const { getUuidValue } = require('../../utils');

function isParseable(head) {
    return (
        head.indexOf(':pcs-stats:room') !== -1 ||
        // old naming
        head.indexOf(':pcs:stats') !== -1
    );
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {
        parser: 'room-pcs-stats'
    };
    parsedData.token = getUuidValue(log, 'token');
    parsedData._entity = getUuidValue(log, '_entity');

    return parsedData;
}

module.exports = {
    isParseable,
    parser
};
