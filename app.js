'use strict';
const fs = require('fs');
const pm2 = require('pm2');
const pmx = require('pmx');
const gelf = require('gelf-pro');
const { parseLogHead, parseLog } = require('./parsers');
const { computeBaseExtras } = require('./utils');

const _env = pmx.initModule();
const config = {
    adapterName: 'tcp-tls',
    adapterOptions: {
        host: 'gra2.logs.ovh.com',
        port: 12202
    }
};
let value = _env['gelf_adapterOptions_host'];
if (value !== undefined) {
    config.adapterOptions.host = value;
}
value = _env['gelf_adapterOptions_port'];
if (value !== undefined) {
    config.adapterOptions.port = value;
}
value = _env['gelf_adapterName'];
if (value !== undefined) {
    config.adapterName = value;
}
value = _env['gelf_fields'];
if (value !== undefined) {
    try {
        config.fields = JSON.parse(value);
        console.log(`pm2-gelf-pro connector: "fields" set to ${value}`);
    } catch (err) {
        console.error(err);
    }
}
value = _env['gelf_adapterOptions_certpath'];
if (value !== undefined) {
    const cert = fs.readFileSync(value);
    config.adapterOptions.cert = cert;
} else if (config.adapterName === 'tcp-tls') {
    config.adapterName = 'tcp';
    if (_env['gelf_adapterOptions_port'] === undefined) {
        config.adapterOptions.port = 2202;
    }
    console.log(
        `pm2-gelf-pro connector: "certpath" is missing. swith to "${config.adapterName}:${config.adapterOptions.port}`
    );
}

gelf.setConfig(config);

pm2.Client.launchBus(function (err, bus) {
    if (err) return console.error('pm2-gelf-pro:', err);

    console.log(
        `pm2-gelf-pro connector: Bus connected, sending logs to ${config.adapterOptions.host}:${config.adapterOptions.port} over ${config.adapterName}`
    );

    bus.on('log:out', function (log) {
        if (log.process.name !== 'pm2-gelf-pro') {
            // console.log(log.process.name, log.data);
            const { head, level, type, subType, body } = parseLogHead(log.data);
            gelf[level](log.data, {
                type,
                subType,
                ...computeBaseExtras(log),
                ...parseLog(head, body)
            });
        }
    });

    bus.on('log:err', function (log) {
        if (log.process.name !== 'pm2-gelf-pro') {
            // console.error(log.process.name, log.data);
            gelf.log(log.data, { application_name: log.process.name });
        }
    });

    bus.on('reconnect attempt', function () {
        console.log('pm2-gelf-pro connector: Bus reconnecting');
    });

    bus.on('close', function () {
        console.log('pm2-gelf-pro connector: Bus closed');
        pm2.disconnectBus();
    });
});
