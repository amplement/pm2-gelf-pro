const { getMatchSimpleValue, getMatchUserValues } = require('../../utils');

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
    parsedData.status = getMatchSimpleValue(log, /(status [a-zA-Z-]*)/g);
    parsedData.token = getMatchSimpleValue(log, /(token [a-f0-9-]{36})/g);
    parsedData._entity = getMatchSimpleValue(log, /(_entity [a-f0-9-]{36})/g);
    parsedData.profile = getMatchSimpleValue(log, /(profile [a-zA-Z-]*)/g);
    parsedData.serverType = getMatchSimpleValue(log, /(serverType [a-zA-Z-]*)/g);
    parsedData.instanceId = getMatchSimpleValue(log, /(instanceId [0-9]*)/g);
    parsedData.type = getMatchSimpleValue(log, /(type [a-zA-Z-]*)/g);
    parsedData.initiator = getMatchUserValues(log, 'between <{user}> <{client}>');
    parsedData.target = getMatchUserValues(log, 'and <{user}> <{client}>');
    return parsedData;
}

module.exports = { parser, isParseable };
