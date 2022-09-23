const { getMatchSimpleValue } = require('../../utils');

function isParseable(head) {
    return head.indexOf(':pcs:stats') !== -1;
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {
        parser: 'room-pcs-stats'
    };
    parsedData.token = getMatchSimpleValue(log, /(token [a-f0-9-]{36})/g);
    parsedData._entity = getMatchSimpleValue(log, /(_entity [a-f0-9-]{36})/g);

    return parsedData;
}

module.exports = {
    isParseable,
    parser
};
