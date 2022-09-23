const { parseHead } = require('../parsers/index');
const { removeColorCharacters, removeDate } = require('../utils');

function prepareLog(log) {
    return parseHead(removeColorCharacters(removeDate(log)));
}

module.exports = { prepareLog };
