function parser(log) {
    const [ip, , country, , httpVerb, url, responseCode, executionTime, userAgent, _client] = log
        .trim()
        .split(' ');
    return {
        ip: ip.split('').slice(4).join(''),
        country,
        httpVerb: verb.replace(':', ''),
        url,
        responseCode,
        executionTime: parseFloat(executionTime.replace('rt=', '')),
        userAgent,
        _client
    };
}

module.exports = parser;
