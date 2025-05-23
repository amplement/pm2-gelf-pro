/* eslint-disable no-console */
const os = require('os');
const fs = require('fs');
const pm2 = require('pm2');
const pmx = require('pmx');
const gelf = require('gelf-pro');
const { parse: parseLog } = require('./parsers');
const { removeColorCharacters, splitMultipleLogs } = require('./utils');

const _env = pmx.initModule();
const config = {
    adapterName: 'tcp-tls',
    adapterOptions: {
        host: 'gra2.logs.ovh.com',
        port: 12202
    }
};
let value = _env.gelf_adapterOptions_host;
if (value !== undefined) {
    config.adapterOptions.host = value;
}
value = _env.gelf_adapterOptions_port;
if (value !== undefined) {
    config.adapterOptions.port = value;
}
value = _env.gelf_adapterName;
if (value !== undefined) {
    config.adapterName = value;
}
value = _env.gelf_fields;
if (value !== undefined) {
    try {
        config.fields = JSON.parse(value);
        console.log(`pm2-gelf-pro connector: "fields" set to ${value}`);
    } catch (err) {
        console.error(err);
    }
}
value = _env.gelf_adapterOptions_certpath;
if (value !== undefined) {
    config.adapterOptions.cert = fs.readFileSync(value);
} else if (config.adapterName === 'tcp-tls') {
    config.adapterName = 'tcp';
    if (_env.gelf_adapterOptions_port === undefined) {
        config.adapterOptions.port = 2202;
    }
    console.log(
        `pm2-gelf-pro connector: "certpath" is missing. swith to "${config.adapterName}:${config.adapterOptions.port}`
    );
}

gelf.setConfig(config);

pm2.Client.launchBus((err, bus) => {
    if (err) return console.error('pm2-gelf-pro:', err);

    console.log(
        `pm2-gelf-pro connector: Bus connected, sending logs to ${config.adapterOptions.host}:${
            config.adapterOptions.port
        } over ${config.adapterName} from from host ${os.hostname()}`
    );

    function handleLog(log, isError = false) {
        if (log.process.name !== '@amplement/pm2-gelf-pro') {
            const processStart = new Date();
            const cleanedData = removeColorCharacters(log.data);
            splitMultipleLogs(cleanedData).forEach((line) => {
                const { logLevel, additionalData } = parseLog(log, line, isError);
                const processEnd = new Date();
                gelf[logLevel](line, {
                    ...additionalData,
                    processedAt: +processStart,
                    processDuration: `${processEnd - processStart} ms`,
                    fullMessage: cleanedData
                });
            });
        }
    }

    bus.on('log:out', (log) => {
        handleLog(log);
    });

    bus.on('log:err', (log) => {
        handleLog(log, true);
    });

    bus.on('reconnect attempt', () => {
        console.log('@amplement/pm2-gelf-pro connector: Bus reconnecting');
    });

    bus.on('close', () => {
        console.log('@amplement/pm2-gelf-pro connector: Bus closed');
        pm2.disconnectBus();
    });
});
