function removeColorCharacters(log) {
    // eslint-disable-next-line no-control-regex
    return log.replace(/\x1b/g, '').replace(/\[[0-9;]{1,11}m/g, '');
}

module.exports = { removeColorCharacters };
