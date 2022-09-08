const os = require('os');

function computeBaseExtras(log) {
    return {
        host: os.hostname(),
        applicationName: log.process.name
    };
}
module.exports = { computeBaseExtras };
