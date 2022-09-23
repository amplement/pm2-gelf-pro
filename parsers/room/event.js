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
    parsedData._entity = getMatchSimpleValue(log, /(_entity [a-f0-9-]{36})/g);
    parsedData.token = getMatchSimpleValue(log, /(token(:)? [a-f0-9-]{36})/g);
    parsedData.instanceId = getMatchSimpleValue(log, /(instanceId [0-9]*)/g);
    const callData = removeValues({
        userUri: getMatchSimpleValue(log, /(userUri [0-9.@]*)/g),
        handleId: getMatchSimpleValue(log, /(handleId [0-9]*)/g),
        sessionId: getMatchSimpleValue(log, /(sessionId [0-9]*)/g)
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
            initiator: getMatchUserValues(
                log,
                /(between _user ([a-f0-9-]{36}|janus) _client ([a-f0-9-]{36}|janus))/g
            ),
            target: getMatchUserValues(
                log,
                /(and _user ([a-f0-9-]{36}|janus) _client ([a-f0-9-]{36}|janus))/g
            )
        };
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
    if (log.indexOf('Subscriber hangup |') !== -1) {
        if (log.indexOf('between _client') === -1) {
            return {
                initiator: getMatchUserValues(
                    log,
                    /(between _user [a-f0-9-]{36} _client [a-f0-9-]{36})/g
                ),
                target: getMatchUserValues(log, /(and _user [a-f0-9-]{36} _client [a-f0-9-]{36})/g)
            };
        }
        const initiator = log.match(/(between _client [a-f0-9-]{36})/);
        const target = log.match(/(and _client [a-f0-9-]{36})/);
        return {
            initiator: {
                _client: initiator ? initiator[0].split(' ').pop() : '-'
            },
            target: {
                _client: target ? target[0].split(' ').pop() : '-'
            }
        };
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
    if (log.indexOf('Missed incoming call | _user') !== -1) {
        return { target: { _user: getMatchSimpleValue(log, /(user [a-f0-9-]{36})/g) } };
    }
    return {};
}

function parseHangupRegularOutgoingCall(log) {
    if (log.indexOf('Hangup outgoing call ') !== -1) {
        return {
            target: getMatchUserValues(
                log,
                /(_user ([a-f0-9-]{36}|janusServer) _client ([a-f0-9-]{36}|[a-f0-9]{32}))/g
            )
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
