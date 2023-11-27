const { removeValues, getUuidValue, getUserIdValue, getMatchSimpleValue } = require('../utils');

function isParseable(head) {
    return head && head.endsWith(':push:onesignal');
}

function parser(log, head) {
    if (!isParseable(head)) {
        return {};
    }
    const parsedData = {
        parser: 'push-onesignal'
    };

    parsedData._entity = getUuidValue(log, '_entity');
    parsedData._user = getUserIdValue(log, '_user');
    parsedData.providerNotificationId = getUuidValue(log, 'providerNotificationId');
    parsedData.appName = getMatchSimpleValue(log, /(appName [a-zA-Z:]+)/);

    return removeValues(parsedData);
}

module.exports = {
    isParseable,
    parser
};
