function getVersion(urlPart) {
    if (!!urlPart.match(/v[0-9]{1,3}/g)) {
        return parseInt(urlPart.replace('v', ''), 10);
    }
    return 1;
}

function isUuid(urlPart) {
    return !!urlPart.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/);
}

function extractQueryParams(url) {
    const [baseUrl, queryParams] = url.split('?');
    return { baseUrl, queryParams };
}

function extractRequestGroup(url) {
    const { baseUrl, queryParams } = extractQueryParams(url);
    const group = { queryParams, admin: false };
    const splittedUrl = baseUrl.split('/');
    group.version = getVersion(splittedUrl[0]);
    if (group.version !== 1) {
        splittedUrl.shift();
    }
    if (splittedUrl[0] === 'admin') {
        group.admin = true;
        splittedUrl.shift();
    }
    group.type = splittedUrl.shift();
    if (splittedUrl[0] && isUuid(splittedUrl[0])) {
        group._entity = splittedUrl.shift();
    }

    if (!splittedUrl[0]) {
        return group;
    }

    if (!isUuid(splittedUrl[0])) {
        group.subType = splittedUrl.shift();
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

function parser(log) {
    const [ip, , country, , httpVerb, url, responseCode, executionTime, userAgent, _client] = log
        .trim()
        .split(' ');
    return {
        ip: ip.split('').slice(4).join(''),
        country,
        httpVerb: httpVerb.replace(':', ''),
        url,
        responseCode,
        executionTime: parseFloat(executionTime.replace('rt=', '')),
        userAgent,
        _client,
        ...extractRequestGroup(url)
    };
}

module.exports = parser;
