const { getMatchSimpleValue, removeValues, getUuidValue } = require('../utils');

function isParseable(head) {
    return head && head.indexOf(':wss') !== -1;
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {
        parser: 'wss'
    };
    const [direction, code] = log.split(' ');
    parsedData.direction = direction === '⭡' ? 'emitting' : 'receiving';
    parsedData.code = code;
    parsedData.ip = getMatchSimpleValue(log, /(ip [a-f0-9.:]*)/);
    parsedData.device = getMatchSimpleValue(log, /(device [a-zA-Z]*)/);
    parsedData.user = removeValues({
        _user: getUuidValue(log, '_user'),
        _client: getUuidValue(log, '_client'),
        _spark: getUuidValue(log, '_spark')
    });

    return removeValues(parsedData);
}

module.exports = {
    isParseable,
    parser
};
