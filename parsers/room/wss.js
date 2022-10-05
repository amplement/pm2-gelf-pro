const { removeValues, getUuidValue } = require('../../utils');
const { parser: baseWssParser } = require('../wss');

function isParseable(head) {
    return head && (head.indexOf(':wss:wrtc') !== -1 || head.indexOf(':wss:room') !== -1);
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {
        ...baseWssParser(log, head),
        parser: 'room-wss'
    };
    parsedData._entity = getUuidValue(log, '_entity');
    parsedData.token = getUuidValue(log, 'token');
    return removeValues(parsedData);
}

module.exports = {
    isParseable,
    parser
};
