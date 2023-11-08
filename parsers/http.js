const { TYPES, extractContext } = require('../utils');
const FULL_UUID_PATTERN = new RegExp(`^${TYPES.UUID}$`);
const CLIENT_PATTERN = new RegExp(`(${TYPES.UUID}$)`);
const UUID_PATTERN = new RegExp(TYPES.UUID);

function isParseable(log, head) {
    return !!(
        head &&
        head.match(/:http:?/) &&
        log &&
        log.match(/(POST|GET|PATCH|DELETE|HEAD|PUT):/)
    );
}

function isString(value) {
    return value && typeof value === 'string';
}

function getVersion(urlPart) {
    if (isString(urlPart) && !!urlPart.match(/v[0-9]{1,3}/)) {
        return parseInt(urlPart.replace('v', ''), 10);
    }
    return 1;
}

function isUuid(urlPart) {
    return !!(isString(urlPart) && urlPart.match(FULL_UUID_PATTERN));
}

function extractQueryParams(url) {
    const [baseUrl, queryParams] = url.split('?');
    return { baseUrl: baseUrl.replace(/^\//, ''), ...(queryParams ? { queryParams } : {}) };
}

function extractRequestGroup(url) {
    const { baseUrl, queryParams } = extractQueryParams(url);
    const group = {
        ...(queryParams ? { queryParams } : {}),
        admin: false,
        basePath: baseUrl.replace(UUID_PATTERN, ':_id').replace(UUID_PATTERN, ':_subId')
    };
    const urlParts = baseUrl.trim().split('/');

    group.version = getVersion(urlParts[0]);
    if (group.version !== 1) {
        urlParts.shift();
    }
    if (urlParts[0] === 'admin') {
        group.admin = true;
        urlParts.shift();
    }
    group.entityType = urlParts.shift();
    if (urlParts[0] && isUuid(urlParts[0])) {
        group._entity = urlParts.shift();
    }

    if (!urlParts[0]) {
        return group;
    }

    if (!group._entity) {
        group.rest = urlParts.join('/');
        return group;
    }

    if (!isUuid(urlParts[0])) {
        group.subEntityType = urlParts.shift();
    }

    if (!urlParts[0]) {
        return group;
    }

    if (isUuid(urlParts[0])) {
        group._subEntity = urlParts.shift();
    }

    if (!urlParts[0]) {
        return group;
    }
    group.rest = urlParts.join('/');

    return group;
}

function extractAndProcessContext(log) {
    const matchedContext = log.match(/({.*}$)/);
    if (matchedContext && matchedContext.length > 0) {
        return {
            context: extractContext(matchedContext[0].trim()),
            log: preventMalformedFields(log.replace(matchedContext[0], '').trim())
        };
    }
    return { log };
}

function preventMalformedFields(log) {
    return preventMalformedIPField(log);
}
function preventMalformedIPField(log) {
    const [ip, ...rest] = log.split(' ');
    const { ip: allIps, rest: cleanedRest } = rest.reduce(
        (acc, part) => {
            const matched = part.match(/(^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3},?)+/gm);
            if (matched && matched.length === 1) {
                acc.ip += `${part}`;
            } else {
                acc.rest.push(part);
            }
            return acc;
        },
        { ip, rest: [] }
    );
    return `${allIps} ${cleanedRest.join(' ')}`;
}

function parseLogQueue(log) {
    const parsed = {};
    let processedLog = log.trim();
    const matchClientId = processedLog.match(CLIENT_PATTERN) || processedLog.match(/-$/g);
    if (matchClientId && matchClientId.length > 0) {
        parsed._client = matchClientId[0];
        processedLog = processedLog.replace(matchClientId[0], '').trim();
    }
    parsed.userAgent = processedLog;
    return parsed;
}

function parser(log, head) {
    if (!isParseable(log, head)) {
        return {};
    }
    const { context, log: logWithoutContext } = extractAndProcessContext(log);
    const [ip, , cloudflareRay, country, , httpVerb, url, responseCode, executionTime, ...rest] =
        logWithoutContext.trim().split(' ');
    const { userAgent, _client } = parseLogQueue(rest.join(' '));
    return {
        parser: 'http',
        ip,
        cfRay: cloudflareRay.replace('cfRay=', ''),
        country,
        httpMethod: httpVerb.replace(':', ''),
        path: url,
        responseCode,
        executionTime: parseFloat(executionTime.replace('rt=', '')),
        userAgent,
        _client,
        ...extractRequestGroup(url),
        ...(context ? { context } : {})
    };
}

module.exports = {
    isParseable,
    extractAndProcessContext,
    parseLogQueue,
    getVersion,
    isUuid,
    extractQueryParams,
    extractRequestGroup,
    parser
};
