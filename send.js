/* eslint-disable */

const fs = require('fs');
const gelf = require('gelf-pro');
const { parse: parseLog } = require('./parsers');
const { removeColorCharacters, removeDate, splitMultipleLogs } = require('./utils');

const _env = process.env;
const config = {
    adapterName: 'tcp-tls',
    adapterOptions: {
        host: 'gra2.logs.ovh.com',
        port: 12202
    }
};
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
value = _env.gelf_fields;
if (value !== undefined) {
    try {
        config.fields = JSON.parse(value);
        console.log(`pm2-gelf-pro connector: "fields" set to ${value}`);
    } catch (err) {
        console.error(err);
    }
}
console.log(config);
gelf.setConfig(config);

const data =
    '2024-12-09T15:09:41.054Z api:info:pcs-stats:room Createdd | retriedTimes 0 initialToken c5337fd5-3081-47c3-8484-c2297c6340d2 profileKey audioLow pcType publisher token c5337fd5-3081-47c3-8484-c2297c6340d2 _entity 47b9ade9-e1f6-4a3b-8587-ab3698fe11e7 _user 1bf09a45-ed3e-4de1-9373-ef36aa509cdc _client 5da516d1-24df-4438-9f11-f1b887f7f6b8 country FR userAgent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"';
const log = {
    data,
    process: {
        name: 'api-server'
    }
};
const processStart = new Date();
const cleanedData = removeColorCharacters(log.data);
splitMultipleLogs(cleanedData).forEach((line) => {
    const { logLevel, additionalData } = parseLog(log, removeDate(line), false);
    const processEnd = new Date();
    const data = {
        ...additionalData,
        processedAt: +processStart,
        processDuration: `${processEnd - processStart} ms`,
        fullMessage: cleanedData
    };
    gelf[logLevel](line, data);
    console.log(line, data);
});
