const os = require('os');
const { parser: httpParser } = require('./http');

function computeBaseExtras(log) {
    return {
        host: os.hostname(),
        applicationName: log.process.name
    };
}

function parse(log, isError = false) {
    let additionalData = {};
    let logLevel = 'info';
    try {
        const { head, level, type, subType, body } = parseHead(log.data);
        logLevel = level;
        additionalData = {
            type,
            subType,
            ...computeBaseExtras(log),
            ...parseBody(head, body)
        };
    } catch (e) {
        additionalData.processingError = true;
        additionalData.errorDetails = e;
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

function parseBody(head, body) {
    if (head.endsWith(':http') && body.match(/(POST|GET|PATCH|DELETE|HEAD|PUT):/)) {
        return httpParser(body);
    } else {
        return {};
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
            return 'notice';
    }
}

module.exports = parse;
