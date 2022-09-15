const { getMatchSimpleValue, getMatchUserValues } = require('../../utils');

function isParseableWss(log) {
    return log && log.indexOf('connection state change to') !== -1;
}

function isParseablePCS(head) {
    return head.indexOf(':pcs') !== -1;
}

function isParseableEvent(head) {
    return head.indexOf(':event:room') !== -1;
}

function isParseable(log, head) {
    return isParseablePCS(head) || isParseableWss(log) || isParseableEvent(head);
}

function parser(log, head) {
    if (isParseablePCS(head)) {
        return parsePcs(log);
    } else if (isParseableWss(log)) {
        return parseWss(log);
    } else if (isParseableEvent(head)) {
        return parseEvent(log);
    }
    return {};
}

function parsePcs(log) {
    const parsedData = {};
    parsedData.status = getMatchSimpleValue(log, /(status [a-zA-Z-]*)/g);
    parsedData.profile = getMatchSimpleValue(log, /(profile [a-zA-Z-]*)/g);
    parsedData.serverType = getMatchSimpleValue(log, /(serverType [a-zA-Z-]*)/g);
    if (parsedData.type === '-') {
        parsedData.type = getMatchSimpleValue(log, /(type [a-zA-Z-]*)/g);
    }
    if (parsedData.initiator === null) {
        parsedData.initiator = getMatchUserValues(
            log,
            /(between _user [a-f0-9-]{36} _client [a-f0-9-]{36})/g
        );
    }
    if (parsedData.target === null) {
        parsedData.target = getMatchUserValues(
            log,
            /(and _user [a-f0-9-]{36} _client [a-f0-9-]{36})/g
        );
    }
    return parsedData;
}

function parseEvent(log) {
    // 2022-03-24T15:07:57.010Z api:debug:event:room Publisher ready received from janus for publisherId a70c81e5-a33e-4d1a-a11f-448a5c76cc98.audioLow with token: ba666701-754d-4bd9-b4f7-6ec0a0a4ac5f and profile audioLow | _room 337592f6-8cfd-4096-b826-98b051eea418
    const parsedData = {};

    // todo extract more  data
    if (log.indexOf(':room Publisher ready ') !== -1) {
        parsedData.profile = getMatchSimpleValue(log, /(profile [\w]*)/g);
    }
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

function parseAction(log, type = 'pcs') {
    const regexp = /^((.*)\\|)/g;
    const matchedAction = log.match(regexp);
    if (!matchedAction || matchedAction.length > 1) {
        throw new Error(`Action not found in: ${log}`);
    }
    return matchedAction[0].replace(`:${type}:room `, '').replace(' |', '');
}

module.exports = { parser, isParseable };
