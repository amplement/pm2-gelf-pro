const { getMatchSimpleValue, getMatchUserValues, removeValues } = require('../../utils');

function isParseable(head) {
    return head.indexOf(':event:room') !== -1;
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
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

    if (!parsedData.callData && log.indexOf('handle/session') !== -1) {
        const data = getMatchSimpleValue(log, /(handle\/session [0-9/]*)/g);
        const [handleId, sessionId] = data.split('/');
        parsedData.callData = { handleId, sessionId };
    }

    return removeValues({
        parser: 'room-event',
        ...parsedData,
        ...parseMediaEvent(log),
        ...parseSubscriberHangup(log),
        ...parseFocusStack(log),
        ...parseHighPublisherReady(log),
        ...parsePublisherReady(log),
        ...parseResponderProperty(log),
        ...parseMissedRegularIncomingCall(log),
        ...parseDispatchingReleaseCall(log),
        ...parseHangupRegularOutgoingCall(log)
    });
}

function parsePublisherReady(log) {
    if (log.indexOf('Publisher ready received') !== -1) {
        return { initiator: { _user: getMatchSimpleValue(log, /(publisherId [a-f0-9-]{36})/g) } };
    }
    return {};
}

function parseHighPublisherReady(log) {
    if (log.indexOf('High publisher ready') !== -1) {
        const data = {
            initiator: { _user: getMatchSimpleValue(log, /(publisherId [a-f0-9-]{36})/g) },
            target: { _client: getMatchSimpleValue(log, /(subscriberClient [a-f0-9-]{36})/g) }
        };

        if (data.initiator._user !== '-') {
            data.profile = getMatchSimpleValue(log, /(publisherId [a-zA-Z0-9-.]*)/g).split('.')[1];
        }
        return data;
    }
    return {};
}

function parseFocusStack(log) {
    if (log.indexOf('Client focus processing - targeted publisher not ready') !== -1) {
        return {
            initiator: getMatchUserValues(
                log,
                /(_user ([a-f0-9-]{36}|janusServer) _client ([a-f0-9-]{36}|[a-f0-9]{32}))/g
            ),
            target: { _client: getMatchSimpleValue(log, /(_targetedClient [a-f0-9-]{36})/g) }
        };
    }
    return {};
}

function parseSubscriberHangup(log) {
    if (log.indexOf('Subscriber hangup received from') !== -1) {
        const data = {
            initiator: { _user: getMatchSimpleValue(log, /(publisherId [a-f0-9-]{36})/g) },
            target: { _user: getMatchSimpleValue(log, /(subscriberId [a-f0-9-]{36})/g) }
        };

        if (data.initiator._users !== '-') {
            data.profile = getMatchSimpleValue(log, /(publisherId [a-zA-Z0-9-.]*)/g).split('.')[1];
        }
        return data;
    }
    return {};
}

function parseMediaEvent(log) {
    if (log.indexOf('media event received') !== -1) {
        return {
            target: { _user: getMatchSimpleValue(log, /(user [a-f0-9-]{36})/g) },
            receiving: getMatchSimpleValue(log, /(receiving (true|false))/g) === 'true'
        };
    }
    return {};
}

function parseResponderProperty(log) {
    if (log.indexOf("Responder property '") !== -1) {
        return {
            initiator: getMatchUserValues(
                log,
                /(_user ([a-f0-9-]{36}|janusServer) with _client ([a-f0-9-]{36}|[a-f0-9]{32}))/g
            )
        };
    }
    return {};
}

function parseMissedRegularIncomingCall(log) {
    if (log.indexOf('Missed incoming call: user ') !== -1) {
        return { target: { _user: getMatchSimpleValue(log, /(user [a-f0-9-]{36})/g) } };
    }
    return {};
}

function parseHangupRegularOutgoingCall(log) {
    if (log.indexOf('Hangup outgoing call: call ') !== -1) {
        return {
            target: {
                _user: getMatchSimpleValue(log, /(callerId: [a-f0-9-]{36})/g),
                _client: getMatchSimpleValue(log, /(_client: [a-f0-9-]{36})/g)
            }
        };
    }
    return {};
}

function parseDispatchingReleaseCall(log) {
    if (log.indexOf('dispatching release call') !== -1) {
        return {
            target: getMatchUserValues(
                log,
                /(for _user ([a-f0-9-]{36}|janusServer) _client ([a-f0-9-]{36}|[a-f0-9]{32}))/g
            )
        };
    }
    return {};
}

module.exports = { isParseable, parser };
