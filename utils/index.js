function removeColorCharacters(log) {
    // eslint-disable-next-line no-control-regex
    return log.replace(/\x1b/g, '').replace(/\[[0-9;]{1,11}m/g, '');
}

function getMatchSimpleValue(line, regexp, splitChar = ' ') {
    const matchResponse = line.match(regexp);
    if (matchResponse && matchResponse.length === 1) {
        return matchResponse[0].split(splitChar)[1];
    }
    return '-';
}

function getMatchUserValues(line, regexp, splitChar = ' ') {
    const matchResponse = line.match(regexp);
    if (matchResponse && matchResponse.length === 1) {
        return {
            _user: getMatchSimpleValue(
                matchResponse[0],
                /(_user ([a-f0-9-]{36}|janusServer|janus))/g,
                splitChar
            ),
            _client: getMatchSimpleValue(
                matchResponse[0],
                /(_client ([a-f0-9-]{36}|[a-f0-9]{32}|janusServer|janus))/g,
                splitChar
            )
        };
    }
    return null;
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

module.exports = {
    removeColorCharacters,
    getMatchSimpleValue,
    getMatchUserValues,
    removeDate,
    removeValues
};
