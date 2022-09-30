const TYPES = {
    UUID: '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',
    USER_ID: '([a-f0-9-]{36}|janusServer|janus)',
    CLIENT_ID: '([a-f0-9-]{36}|[a-f0-9]{32}|janusServer|janus)'
};

function removeColorCharacters(log) {
    // eslint-disable-next-line no-control-regex
    return log.replace(/\x1b/g, '').replace(/\[[0-9;]{1,11}m/g, '');
}

function getUuidValue(log, key, splitChar = ' ') {
    return getMatchSimpleValue(log, new RegExp(`(${key}${splitChar}${TYPES.UUID})`), splitChar);
}

function getUserIdValue(log, key, splitChar = ' ') {
    return getMatchSimpleValue(log, new RegExp(`(${key}${splitChar}${TYPES.USER_ID})`), splitChar);
}

function getClientIdValue(log, key, splitChar = ' ') {
    return getMatchSimpleValue(
        log,
        new RegExp(`(${key}${splitChar}${TYPES.CLIENT_ID})`),
        splitChar
    );
}

function getMatchSimpleValue(line, regexp, splitChar = ' ') {
    const matchResponse = line.match(regexp);
    if (matchResponse && matchResponse.length >= 1) {
        return matchResponse[0].split(splitChar).pop();
    }
    return '-';
}

/**
 * Get _user and _client in one action
 * @param {string} line
 * @param {string} template The global structure e.g. "between _user xx with _client yy" should be "between <{_user}> with <{_client}>" <{_user|_client}> will be replaced by: "options.userKey+options.splitChar+options.userPattern"
 * @param {Object} [options={}]
 * @param {string} [options.splitChar=' ']
 * @param {string} [options.userKey='_user']
 * @param {string} [options.userPattern='([a-f0-9-]{36}|janusServer|janus)']
 * @param {string} [options.clientKey='_client']
 * @param {string} [options.clientPattern='([a-f0-9-]{36}|[a-f0-9]{32}|janusServer|janus)']
 * @returns {{_client: (*|string), _user: (*|string)}|null}
 */
function getMatchUserValues(line, template, options = {}) {
    const opts = {
        splitChar: ' ',
        userKey: '_user',
        userPattern: TYPES.USER_ID,
        clientKey: '_client',
        clientPattern: TYPES.CLIENT_ID,
        ...options
    };
    if (template.indexOf('<{user}>') === -1 || template.indexOf('<{client}>') === -1) {
        throw new Error('Template does not contain <{_user}> and <{_client}>');
    }
    const userPattern = `${opts.userKey}${opts.splitChar}${opts.userPattern}`;
    const clientPattern = `${opts.clientKey}${opts.splitChar}${opts.clientPattern}`;
    const mainPattern = template
        .replace('<{user}>', userPattern)
        .replace('<{client}>', clientPattern);
    const matchResponse = line.match(new RegExp(mainPattern));
    if (matchResponse && matchResponse[0] !== '') {
        return {
            _user: getMatchSimpleValue(
                matchResponse[0],
                new RegExp(`${userPattern}`),
                opts.splitChar
            ),
            _client: getMatchSimpleValue(
                matchResponse[0],
                new RegExp(clientPattern),
                opts.splitChar
            )
        };
    }
    return {
        _user: '-',
        _client: '-'
    };
}

function removeDate(line) {
    return line.replace(/^([0-9-:TZ.]{24} )/, '');
}

function removeValues(data, valueToRemove = '-') {
    return Object.keys(data).reduce((acc, key) => {
        if (data[key] !== valueToRemove) {
            acc[key] = data[key];
        }
        return acc;
    }, {});
}

function splitMultipleLogs(log) {
    if (typeof log !== 'string') {
        return [];
    }
    const match = log.match(/\+[0-9]+ms/g);
    if (match && match.length > 1) {
        return match.reduce(
            (acc, value) => {
                const length = acc.rest.indexOf(value) + value.length;
                const element = acc.rest.substring(0, length).trim();
                acc.rest = acc.rest.substring(length).trim();
                acc.result.push(element);
                return acc;
            },
            { rest: log, result: [] }
        ).result;
    }
    return [log];
}

function extractContext(log) {
    const match = log.match(/(\{[a-zA-Z0-9-_:",]*,"isContext":true})/);
    if (match && match.length > 0) {
        const context = match[0];
        return removeValues({
            _user: getUserIdValue(context, '"_user', '":"'),
            _client: getClientIdValue(context, '"_client', '":"'),
            _company: getUuidValue(context, '"_company', '":"'),
            _spark: getUuidValue(context, '"_spark', '":"'),
            _entity: getUuidValue(context, '"_entity', '":"'),
            id: getUuidValue(context, '"id', '":"')
        });
    }
    return {};
}

module.exports = {
    removeColorCharacters,
    getMatchSimpleValue,
    getMatchUserValues,
    getUuidValue,
    removeDate,
    removeValues,
    splitMultipleLogs,
    extractContext,
    getUserIdValue,
    getClientIdValue,
    TYPES
};
