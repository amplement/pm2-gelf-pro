const {
    getMatchSimpleValue,
    getMatchUserValues,
    removeValues,
    getUuidValue,
    getClientIdValue,
    getUserIdValue
} = require('../../utils');

function isParseable(head) {
    return head.indexOf(':event:room') !== -1;
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {};
    parsedData.profile = getMatchSimpleValue(log, /(profile [a-zA-Z-]*)/);
    parsedData._entity = getUuidValue(log, '_entity');
    parsedData.token = getMatchSimpleValue(log, /(token(:)? [a-f0-9-]{36})/);
    parsedData.instanceId = getMatchSimpleValue(log, /(instanceId [0-9]*)/);
    const callData = removeValues({
        userUri: getMatchSimpleValue(log, /(userUri [0-9.@]*)/),
        handleId: getMatchSimpleValue(log, /(handleId [0-9]*)/),
        sessionId: getMatchSimpleValue(log, /(sessionId [0-9]*)/)
    });
    if (callData.userUri || callData.handleId || callData.sessionId) {
        parsedData.callData = callData;
    }

    return removeValues({
        parser: 'room-event',
        ...parsedData,
        ...parseMediaEvent(log),
        ...parseSubscriberHangup(log),
        ...parseFocusStack(log),
        ...parsePublisherReady(log),
        ...parseResponderProperty(log),
        ...parseMissedRegularIncomingCall(log),
        ...parseDispatchingReleaseCall(log),
        ...parseHangupRegularOutgoingCall(log)
    });
}

function parsePublisherReady(log) {
    if (log.indexOf('ublisher ready') !== -1) {
        return {
            initiator: getMatchUserValues(log, 'between <{user}> <{client}>'),
            target: getMatchUserValues(log, 'and <{user}> <{client}>')
        };
    }
    return {};
}

function parseFocusStack(log) {
    if (log.indexOf('Client focus processing - targeted publisher not ready') !== -1) {
        return {
            initiator: getMatchUserValues(log, '<{user}> <{client}>'),
            target: { _client: getClientIdValue(log, '_targetedClient') }
        };
    }
    return {};
}

function parseSubscriberHangup(log) {
    if (log.indexOf('Subscriber hangup |') !== -1) {
        if (log.indexOf('between _client') === -1) {
            return {
                initiator: getMatchUserValues(log, 'between <{user}> <{client}>'),
                target: getMatchUserValues(log, 'and <{user}> <{client}>')
            };
        }
        return {
            initiator: {
                _client: getClientIdValue(log, 'between _client')
            },
            target: {
                _client: getClientIdValue(log, 'and _client')
            }
        };
    }
    return {};
}

function parseMediaEvent(log) {
    if (log.indexOf('media event received') !== -1) {
        return {
            target: { _user: getUserIdValue(log, 'user') },
            receiving: getMatchSimpleValue(log, /(receiving (true|false))/) === 'true'
        };
    }
    return {};
}

function parseResponderProperty(log) {
    if (log.indexOf("Responder property '") !== -1) {
        return {
            initiator: getMatchUserValues(log, '<{user}> with <{client}>')
        };
    }
    return {};
}

function parseMissedRegularIncomingCall(log) {
    if (log.indexOf('Missed incoming call | _user') !== -1) {
        return { target: { _user: getUserIdValue(log, 'user') } };
    }
    return {};
}

function parseHangupRegularOutgoingCall(log) {
    if (log.indexOf('Hangup outgoing call ') !== -1) {
        return {
            target: getMatchUserValues(log, '<{user}> <{client}>')
        };
    }
    return {};
}

function parseDispatchingReleaseCall(log) {
    if (log.indexOf('dispatching release call') !== -1) {
        return {
            target: getMatchUserValues(log, 'for <{user}> <{client}>')
        };
    }
    return {};
}

module.exports = { isParseable, parser };
