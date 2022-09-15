const { parser: parserPCS, isParseable } = require('./PCS');

function parser(log, head) {
    if (isParseable(log, head)) {
        return parserPCS(log);
    }
    return {};
}

module.exports = { parser, isParseable };
