const DeviceDetector = require('node-device-detector');
const DeviceHelper = require('node-device-detector/helper');

const { getUuidValue, getMatchSimpleValue } = require('../../utils');

const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true
});

function isParseable(head) {
    return (
        head.indexOf(':pcs-stats:room') !== -1 ||
        // old naming deprecated
        head.indexOf(':pcs:stats') !== -1
    );
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {
        parser: 'room-pcs-stats'
    };

    const userAgent = getMatchSimpleValue(log, /(userAgent "([^"\\]*(?:\\.[^"\\]*)*)")/);
    if (userAgent !== '-') {
        const result = detector.detect(log);
        parsedData.uaIsBrowser = DeviceHelper.isBrowser(result);
        parsedData.uaOsName = result.os.name || '-';
        parsedData.uaClientName = result.client.name || '-';
    }

    parsedData.token = getUuidValue(log, 'token');
    parsedData.initialToken = getUuidValue(log, 'initialToken');
    parsedData._entity = getUuidValue(log, '_entity');
    parsedData._user = getUuidValue(log, '_user');
    parsedData._client = getUuidValue(log, '_client');
    parsedData.country = getMatchSimpleValue(log, /(country [A-Z-]+)/);
    parsedData.pcType = getMatchSimpleValue(log, /(pcType [a-zA-Z-]+)/);
    parsedData.pcState = getMatchSimpleValue(log, /(pcState [a-zA-Z-]+)/);
    parsedData.retriedTimes = getMatchSimpleValue(log, /(retriedTimes [0-9]+)/);
    parsedData.iceState = getMatchSimpleValue(log, /(iceState [a-zA-Z-]+)/);
    parsedData.profileKey = getMatchSimpleValue(log, /(profileKey [a-zA-Z-]+)/);

    return parsedData;
}

module.exports = {
    isParseable,
    parser
};
