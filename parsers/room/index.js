const { parser: parserPCS, isParseable: isParseablePCS } = require('./PCS');
const { parser: parserEvent, isParseable: isParseableEvent } = require('./event');

function isParseable(log, head) {
    return isParseablePCS(log, head) || isParseableEvent(log, head);
}

function parser(log, head) {
    if (isParseablePCS(log, head)) {
        return parserPCS(log);
    } else if (isParseableEvent(log, head)) {
        return parserEvent(log, head);
    }
    return {};
}

module.exports = { parser, isParseable };
