const { removeValues, getUuidValue, getUserIdValue, getClientIdValue } = require('../../utils');

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
    parsedData._entity = getUuidValue(log, '_entity');

    return removeValues({
        ...parsedData,
        ...parseCreateSipPCS(log),
        ...parseLimitedRemovingActions(log)
    });
}

function parseCreateSipPCS(log) {
    if (log.indexOf('Create sip PCS ') !== -1) {
        return {
            initiator: { _user: getUserIdValue(log, '_user') }
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
                _client: getClientIdValue(log, '_client')
            }
        };
    }
    return {};
}

module.exports = { isParseable, parser };
