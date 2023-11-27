const os = require('os');
const { parser: httpParser, isParseable: isParseableHttp } = require('./http');
const { parser: roomParser, isParseable: isParseableRoom } = require('./room');
const { parser: wssParser, isParseable: isParseableWss } = require('./wss');
const { parser: pushParser, isParseable: isParseablePush } = require('./push');

function computeBaseExtras(log) {
    return {
        host: os.hostname(),
        applicationName: log.process.name
    };
}

function parse(log, message, isError = false) {
    let additionalData = {};
    let logLevel = 'info';
    try {
        const { head, origin, level, type, entity, body } = parseHead(message);
        logLevel = level;
        additionalData = {
            origin,
            type,
            entity,
            ...computeBaseExtras(log),
            ...parseBody(head, body)
        };
    } catch (e) {
        additionalData.processingError = true;
        additionalData.errorDetails = e.message;
    }
    return { logLevel: isError ? 'error' : logLevel, additionalData };
}

function parseHead(line) {
    const [head, ...body] = line.trim().split(' ');
    const [origin, level, type, entity, ...rest] = head.split(':');
    return {
        head,
        origin,
        level: convertLevel(level),
        type,
        entity,
        headRest: rest,
        body: body.join(' ')
    };
}

/**
 * Parser selector.
 * Order is important here as some logs can be processed by multiple parser
 * ex: wss-room log work with room-wss AND wss parser.
 * Strict parsers should occur first
 * @param {string} head
 * @param {string} log
 * @returns {Object}
 */
function parseBody(head, log) {
    if (isParseableHttp(log, head)) {
        return httpParser(log, head);
    } else if (isParseableRoom(head)) {
        return roomParser(log, head);
    } else if (isParseableWss(head)) {
        return wssParser(log, head);
    } else if (isParseablePush(head)) {
        return pushParser(log, head);
    } else {
        return {
            parser: 'not-available'
        };
    }
}

function convertLevel(level) {
    switch (level) {
        case 'trace':
        case 'debug':
            return 'debug';
        case 'info':
            return 'info';
        case 'log':
            return 'notice';
        case 'warn':
            return 'warning';
        case 'error':
            return 'error';
        default:
            return 'info';
    }
}

module.exports = {
    parseHead,
    parse,
    computeBaseExtras
};
