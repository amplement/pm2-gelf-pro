const os = require('os');
const { parser: httpParser, isParseable: isParseableHttp } = require('./http');
const { parser: roomParser, isParseable: isParseableRoom } = require('./room');

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
        const { head, level, type, subType, body } = parseHead(message);
        logLevel = level;
        additionalData = {
            type,
            subType,
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
    const [service, level, type, subType, ...rest] = head.split(':');
    return {
        head,
        service,
        level: convertLevel(level),
        type,
        subType,
        headRest: rest,
        body: body.join(' ')
    };
}

function parseBody(head, log) {
    if (isParseableHttp(log, head)) {
        return httpParser(log);
    } else if (isParseableRoom(head)) {
        return roomParser(log, head);
    }
    return {
        parser: 'not-available'
    };
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
    parse
};
