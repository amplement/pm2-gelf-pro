const { getMatchSimpleValue, removeValues } = require('../../utils');

function isParseable(head) {
    return !!(head && head.match(/:action:room$/));
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {
        parser: 'room-action'
    };
    parsedData._entity = getMatchSimpleValue(log, /(_entity [a-f0-9-]{36})/g);

    return removeValues({
        ...parsedData,
        ...parseCreateSipPCS(log),
        ...parseLimitedRemovingActions(log)
    });
}

function parseCreateSipPCS(log) {
    if (log.indexOf('Create sip PCS ') !== -1) {
        return {
            initiator: { _user: getMatchSimpleValue(log, /(_user ([a-f0-9-]{36}|janusServer))/g) }
        };
    }
    return {};
}

function parseLimitedRemovingActions(log) {
    if (
        log.indexOf('Removing PCS audio level') !== -1 ||
        log.indexOf('Removing all PCS for ') !== -1
    ) {
        return {
            initiator: {
                _client: getMatchSimpleValue(log, /(_client [a-f0-9-]{36})/g)
            }
        };
    }
    return {};
}

module.exports = { isParseable, parser };
