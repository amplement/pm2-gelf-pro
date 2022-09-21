const { getMatchSimpleValue } = require('../../utils');

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
    parsedData._entity = getMatchSimpleValue(log, /(_room [a-f0-9-]{36})/g);

    return {
        ...parsedData,
        ...parseCreateSipOutgoingPCS(log)
    };
}

function parseCreateSipOutgoingPCS(log) {
    if (log.indexOf('Create sip PCS (outgoing call situation)') !== -1) {
        return {
            initiator: { _user: getMatchSimpleValue(log, /(_user [a-f0-9-]{36})/g) }
        };
    }
}

module.exports = { isParseable, parser };
