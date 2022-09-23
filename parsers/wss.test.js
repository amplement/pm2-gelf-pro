const { parser } = require('./wss');
const { prepareLog } = require('../__test__/utils');

describe('wss parser', () => {
    it('should handle POST_FEED_ITEM event log', () => {
        const fullLog =
            'api:trace:wss ⭡ POST_FEED_ITEM to _user f10bcd85-3c6d-46b0-9039-db4d42469f14 _spark a9200c93-030b-47fd-85b2-1724cb9f98f8 ip 78.119.123.160';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'wss',
            code: 'POST_FEED_ITEM',
            user: {
                _user: 'f10bcd85-3c6d-46b0-9039-db4d42469f14',
                _spark: 'a9200c93-030b-47fd-85b2-1724cb9f98f8'
            },
            ip: '78.119.123.160',
            direction: 'emitting'
        });
    });
});
