const { parser: parserPCS, isParseable: isParseablePCS } = require('./PCS');
const { parser: parserEvent, isParseable: isParseableEvent } = require('./event');
const { parser: parseWss, isParseable: isParseableWss } = require('./wss');
const { parser: parseAction, isParseable: isParseableAction } = require('./action');

function isParseable(head) {
    return (
        isParseablePCS(head) ||
        isParseableEvent(head) ||
        isParseableWss(head) ||
        isParseableAction(head)
    );
}

function parser(log, head) {
    if (isParseablePCS(head)) {
        return parserPCS(log, head);
    } else if (isParseableEvent(head)) {
        return parserEvent(log, head);
    } else if (isParseableWss(head)) {
        return parseWss(log, head);
    } else if (isParseableAction(head)) {
        return parseAction(log, head);
    }
    return {};
}

module.exports = { parser, isParseable };
