const { getMatchSimpleValue, getMatchUserValues, getUuidValue } = require('../../utils');

function isParseable(head) {
    return !!(head && head.match(/:pcs:room$/));
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {
        parser: 'room-pcs'
    };
    parsedData.action = log.split('|')[0].trim();
    parsedData.status = getMatchSimpleValue(log, /(status [a-zA-Z-]*)/);
    parsedData.token = getUuidValue(log, 'token');
    parsedData._entity = getUuidValue(log, '_entity');
    parsedData.profileKey = getMatchSimpleValue(log, /(profileKey [a-zA-Z-]*)/);
    parsedData.serverType = getMatchSimpleValue(log, /(serverType [a-zA-Z-]*)/);
    parsedData.instanceId = getMatchSimpleValue(log, /(instanceId [0-9]*)/);
    parsedData.peerType = getMatchSimpleValue(log, /(type [a-zA-Z-]*)/);
    parsedData.initiator = getMatchUserValues(log, 'between <{user}> <{client}>');
    parsedData.target = getMatchUserValues(log, 'and <{user}> <{client}>');
    return parsedData;
}
module.exports = { parser, isParseable };
