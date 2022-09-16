const { getMatchSimpleValue, getMatchUserValues } = require('../../utils');

function isParseable(head) {
    return head.indexOf(':event:room') !== -1;
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    // 2022-03-24T15:07:57.010Z api:debug:event:room Publisher ready received from janus for publisherId a70c81e5-a33e-4d1a-a11f-448a5c76cc98.audioLow with token: ba666701-754d-4bd9-b4f7-6ec0a0a4ac5f and profile audioLow | _room 337592f6-8cfd-4096-b826-98b051eea418
    const parsedData = {};
    parsedData.profile = getMatchSimpleValue(log, /(profile [a-zA-Z-]*)/g);
    parsedData._entity = getMatchSimpleValue(log, /(_room [a-f0-9-]{36})/g);
    parsedData.token = getMatchSimpleValue(log, /(token(:)? [a-f0-9-]{36})/g);
    parsedData.instanceId = getMatchSimpleValue(log, /(instanceId [0-9]*)/g);
    const callData = removeValues({
        userUri: getMatchSimpleValue(log, /(userUri [0-9.@]*)/g),
        handleId: getMatchSimpleValue(log, /((handleId|handle) [0-9]*)/g),
        sessionId: getMatchSimpleValue(log, /(sessionId [0-9]*)/g)
    });
    if (callData.userUri || callData.handleId || callData.sessionId) {
        parsedData.callData = callData;
    }
    if (log.indexOf(' for _user ') !== -1) {
        parsedData.target = getMatchUserValues(
            log,
            /(for _user ([a-f0-9-]{36}|janusServer) _client ([a-f0-9-]{36}|[a-f0-9]{32}))/g
        );
    }
    if (!parsedData.target && log.indexOf(' user ') !== -1) {
        parsedData.target = { _user: getMatchSimpleValue(log, /(user [a-f0-9-]{36})/g) };
    }
    if (!parsedData.callData && log.indexOf('handle/session') !== -1) {
        const data = getMatchSimpleValue(log, /(handle\/session [0-9\/]*)/g);
        const [handleId, sessionId] = data.split('/');
        parsedData.callData = { handleId, sessionId };
    }
    parsedData.publisherId = getMatchSimpleValue(log, /(publisherId [a-f0-9-]{36})/g);
    parsedData.subscriberId = getMatchSimpleValue(log, /(subscriberId [a-f0-9-]{36})/g);
    if (parsedData.profile === '-' && parsedData.publisherId !== '-') {
        parsedData.profile = getMatchSimpleValue(log, /(publisherId [a-zA-Z0-9-.]*)/g).split('.')[1];
    }
    return removeValues(parsedData);
}

function removeValues(data, valueToRemove = '-') {
    return Object.keys(data).reduce((acc, key) => {
        if (data[key] !== valueToRemove) {
            acc[key] = data[key];
        }
        return acc;
    }, {});
}

module.exports = { isParseable, parser };
