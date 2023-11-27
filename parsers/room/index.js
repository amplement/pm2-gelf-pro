const { parser: parserPcs, isParseable: isParseablePcs } = require('./pcs');
const { parser: parserEvent, isParseable: isParseableEvent } = require('./event');
const { parser: parseWss, isParseable: isParseableWss } = require('./wss');
const { parser: parseService, isParseable: isParseableService } = require('./service');
const { parser: parsePcsStats, isParseable: isParseablePcsStats } = require('./pcs-stats');
const { parser: parseHttp, isParseable: isParseableHttp } = require('./http');

function isParseable(head) {
    return (
        isParseablePcs(head) ||
        isParseableEvent(head) ||
        isParseableWss(head) ||
        isParseableService(head) ||
        isParseablePcsStats(head) ||
        isParseableHttp(head)
    );
}

function parser(log, head) {
    if (isParseablePcs(head)) {
        return parserPcs(log, head);
    } else if (isParseableEvent(head)) {
        return parserEvent(log, head);
    } else if (isParseableWss(head)) {
        return parseWss(log, head);
    } else if (isParseableService(head)) {
        return parseService(log, head);
    } else if (isParseablePcsStats(head)) {
        return parsePcsStats(log, head);
    } else if (isParseableHttp(head)) {
        return parseHttp(log, head);
    }
    return {};
}

module.exports = { parser, isParseable };
