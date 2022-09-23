const { getMatchSimpleValue, removeValues } = require('../utils');

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
    parsedData.ip = getMatchSimpleValue(log, /(ip [a-f0-9.:]*)/g);
    parsedData.device = getMatchSimpleValue(log, /(device [a-zA-Z]*)/g);
    parsedData.user = removeValues({
        _user: getMatchSimpleValue(log, /(_user [a-f0-9-]{36})/g),
        _client: getMatchSimpleValue(log, /(_client [a-f0-9-]{36})/g),
        _spark: getMatchSimpleValue(log, /(_spark [a-f0-9-]{36})/g)
    });

    return removeValues(parsedData);
}

module.exports = {
    isParseable,
    parser
};
