const { removeValues, getUuidValue, getUserIdValue, getClientIdValue } = require('../../utils');

function isParseable(head) {
    return head && head.endsWith(':http:room');
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {
        parser: 'room-http'
    };

    parsedData._entity = getUuidValue(log, '_entity');
    parsedData._user = getUserIdValue(log, '_user');
    parsedData._client = getClientIdValue(log, '_client');

    return removeValues(parsedData);
}

module.exports = {
    isParseable,
    parser
};
