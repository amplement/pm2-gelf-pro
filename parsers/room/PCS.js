const { getMatchSimpleValue, getMatchUserValues } = require('../../utils');
const { getPcsToken } = require('./utils');

function isParseableWss(log) {
    return log && log.indexOf('connection state change to') !== -1;
}

function isParseablePCS(head) {
    return head.indexOf(':pcs') !== -1;
}

function isParseable(log, head) {
    return isParseablePCS(head) || isParseableWss(log);
}

function parser(log, head) {
    if (isParseablePCS(head)) {
        return parsePcs(log);
    } else if (isParseableWss(log)) {
        return parseWss(log);
    }
    return {};
}

function parsePcs(log) {
    const parsedData = {};
    parsedData.action = log.split('|')[0].trim();
    parsedData.status = getMatchSimpleValue(log, /(status [a-zA-Z-]*)/g);
    parsedData.token = getPcsToken(log);
    parsedData._entity = getMatchSimpleValue(log, /(entity [a-f0-9-]{36})/g);
    parsedData.profile = getMatchSimpleValue(log, /(profile [a-zA-Z-]*)/g);
    parsedData.serverType = getMatchSimpleValue(log, /(serverType [a-zA-Z-]*)/g);
    parsedData.instanceId = getMatchSimpleValue(log, /(instanceId [0-9]*)/g);
    parsedData.type = getMatchSimpleValue(log, /(type [a-zA-Z-]*)/g);
    parsedData.initiator = getMatchUserValues(
        log,
        /(between _user ([a-f0-9-]{36}|janusServer) _client ([a-f0-9-]{36}|[a-f0-9]{32}))/g
    );
    parsedData.target = getMatchUserValues(
        log,
        /(and _user ([a-f0-9-]{36}|janusServer) _client ([a-f0-9-]{36}|[a-f0-9]{32}))/g
    );
    return parsedData;
}

function parseWss(log, head) {
    const parsedData = {};
    const action = parseAction(log, 'wss');
    if (!action) {
        throw new Error(`Action not found in: ${log}`);
    }
    const [type, state] = action.split(' connection state change to ');
    switch (type) {
        case 'PC':
            parsedData.pcState = state;
            break;
        case 'ICE':
            parsedData.iceState = state;
            break;
        default:
            throw new Error(`Unexpected wss action: ${type}`);
    }
    return parsedData;
}

function parseAction(log) {
    const regexp = /^((.*)\\|)/g;
    const matchedAction = log.match(regexp);
    if (!matchedAction || matchedAction.length > 1) {
        throw new Error(`Action not found in: ${log}`);
    }
    return matchedAction[0];
}

module.exports = { parser, isParseable };
