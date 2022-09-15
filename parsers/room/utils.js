function getPcsToken(line) {
    return extractToken(line.match(/(token [a-f0-9-]{36})/g), line);
}

function extractToken(tokenMatch, line) {
    if (tokenMatch && tokenMatch.length === 1) {
        return tokenMatch[0].split(' ')[1];
    } else if (tokenMatch && tokenMatch.length > 1) {
        throw new Error(`Two match for one token on line: ${line}`);
    }
}

module.exports = { getPcsToken };
