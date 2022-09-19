const { getMatchSimpleValue } = require('../../utils');

function isParseable(head) {
    return head && (head.indexOf(':wss:wrtc') !== -1 || head.indexOf(':wss:room') !== -1);
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {
        parser: 'room-wss'
    };
    const [direction, code] = log.split(' ');
    parsedData.direction = direction === '⭡' ? 'emitting' : 'receiving';
    parsedData.code = code;
    parsedData._entity = getMatchSimpleValue(log, /(_room [a-f0-9-]{36})/g);
    return parsedData;
}

module.exports = {
    isParseable,
    parser
};
