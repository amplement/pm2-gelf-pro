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
            userId: this._getMatchSimpleValue(
                matchResponse[0],
                /(_user [a-f0-9-]{36})/g,
                splitChar
            ),
            clientId: this._getMatchSimpleValue(
                matchResponse[0],
                /(_client [a-f0-9-]{36})/g,
                splitChar
            )
        };
    }
    return null;
}

module.exports = { removeColorCharacters, getMatchSimpleValue, getMatchUserValues };
