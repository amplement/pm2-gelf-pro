const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
function isString(value) {
    return value && typeof value === 'string';
}

function getVersion(urlPart) {
    if (isString(urlPart) && !!urlPart.match(/v[0-9]{1,3}/g)) {
        return parseInt(urlPart.replace('v', ''), 10);
    }
    return 1;
}

function isUuid(urlPart) {
    return !!(isString(urlPart) && urlPart.match(UUID_PATTERN));
}

function extractQueryParams(url) {
    const [baseUrl, queryParams] = url.split('?');
    return { baseUrl, ...(queryParams ? { queryParams } : {}) };
}

function extractRequestGroup(url) {
    const { baseUrl, queryParams } = extractQueryParams(url);
    const group = { ...(queryParams ? { queryParams } : {}), admin: false };
    const splittedUrl = baseUrl.trim().split('/');
    if (splittedUrl[0] === '') {
        splittedUrl.shift();
    }
    group.version = getVersion(splittedUrl[0]);
    if (group.version !== 1) {
        splittedUrl.shift();
    }
    if (splittedUrl[0] === 'admin') {
        group.admin = true;
        splittedUrl.shift();
    }
    group.resourceType = splittedUrl.shift();
    if (splittedUrl[0] && isUuid(splittedUrl[0])) {
        group._entity = splittedUrl.shift();
    }

    if (!splittedUrl[0]) {
        return group;
    }

    if (!group._entity) {
        group.rest = splittedUrl.join('/');
        return group;
    }

    if (!isUuid(splittedUrl[0])) {
        group.subResourcesType = splittedUrl.shift();
    }

    if (!splittedUrl[0]) {
        return group;
    }

    if (isUuid(splittedUrl[0])) {
        group._subEntity = splittedUrl.shift();
    }

    if (!splittedUrl[0]) {
        return group;
    }
    group.rest = splittedUrl.join('/');

    return group;
}

function extractAndProcessContext(log) {
    const matchedContext = log.match(/({.*}$)/);
    if (matchedContext && matchedContext.length > 0) {
        return {
            context: matchedContext[0].trim(), // TODO: parse this
            log: log.replace(matchedContext[0], '').trim()
        };
    }
    return { log };
}

function parseLogQueue(log) {
    const parsed = {};
    let processedLog = log.trim();
    const matchClientId = processedLog.match(
        /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$)/
    );
    if (matchClientId && matchClientId.length > 0) {
        parsed._client = matchClientId[0];
        processedLog = processedLog.replace(matchClientId[0], '').trim();
    }
    parsed.userAgent = processedLog;
    return parsed;
}

function cleanIp(ip) {
    const splittedIp = ip.split('');
    if (
        !splittedIp
            .slice(0, 4)
            .join('')
            .match(/^[0-9a-f.:]{4}$/)
    ) {
        return splittedIp.slice(4).join('');
    }
    return ip;
}

function parser(log) {
    const { context, log: logWithoutContext } = extractAndProcessContext(log);
    const [ip, , country, , httpVerb, url, responseCode, executionTime, ...rest] = logWithoutContext
        .trim()
        .split(' ');
    const { userAgent, _client } = parseLogQueue(rest.join(' '));
    return {
	logType: 'http',
        ip: cleanIp(ip),
        country,
        httpVerb: httpVerb.replace(':', ''),
        url,
        responseCode,
        executionTime: parseFloat(executionTime.replace('rt=', '')),
        userAgent,
        _client,
        ...extractRequestGroup(url),
        ...(context ? { context } : {})
    };
}

module.exports = {
    extractAndProcessContext,
    parseLogQueue,
    getVersion,
    isUuid,
    extractQueryParams,
    extractRequestGroup,
    parser
};
