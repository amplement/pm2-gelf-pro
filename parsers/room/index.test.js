const { parseHead } = require('../index');
const { removeColorCharacters, removeDate } = require('../../utils');
const { parser, isParseable } = require('./index');

function prepareLog(log) {
    return parseHead(removeColorCharacters(removeDate(log)));
}

const LOGS = {
    action: '2022-09-16T08:03:38.015Z api:debug:action:room Removing all pcs of the entity 26a33568-129c-4a68-9c82-0fec054b03e2 | _room 26a33568-129c-4a68-9c82-0fec054b03e2',
    event: '2022-09-16T08:03:38.221Z api:debug:event:room Room created for incoming call for userUri 503349001000@85.118.42.49 handleId 6759526312052396 sessionId 1336608306141737 | _room 80648f9d-52ba-4e0a-8d3c-db06b6ba83ca',
    pcs: '2022-09-16T08:07:21.256Z api:debug:pcs:room Create | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa',
    wss: '2022-09-19T09:12:28.718Z api:debug:wss:room ⭡ ROOM_INCOMING to _client d92e _spark b3b9 79.91.77.197 _room b44db1b4-fbb9-43ee-84f8-16fb77a84f00'
};

describe('room parsers index', () => {
    describe('parser', () => {
        it('should handle action log correctly', () => {
            const { head, body: log } = prepareLog(LOGS.action);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-action',
                _entity: '26a33568-129c-4a68-9c82-0fec054b03e2'
            });
        });

        it('should handle event log correctly', () => {
            const { head, body: log } = prepareLog(LOGS.event);
            expect(parser(log, head)).toStrictEqual({
                callData: {
                    userUri: '503349001000@85.118.42.49',
                    handleId: '6759526312052396',
                    sessionId: '1336608306141737'
                },
                _entity: '80648f9d-52ba-4e0a-8d3c-db06b6ba83ca',
                parser: 'room-event'
            });
        });

        it('should handle PCS log correctly', () => {
            const { head, body: log } = prepareLog(LOGS.pcs);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-pcs',
                status: 'waiting',
                token: 'b596298d-070c-40e3-af53-43fcd903a5f3',
                instanceId: '8',
                serverType: '-',
                profile: 'audioLow',
                type: 'incoming',
                _entity: '1c8be699-c2e5-4180-8750-8b18ea19ac40',
                initiator: { _user: 'janusServer', _client: 'a997f9f0e8ebbc33e8e4813d941ad95b' },
                target: {
                    _user: '0e804ed5-ccb6-4f02-9426-c9efa268a315',
                    _client: '7bbb59b5-37a4-48c7-bda1-09160ce781aa'
                },
                action: 'Create'
            });
        });

        it('should handle wss log correctly', () => {
            const { head, body: log } = prepareLog(LOGS.wss);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'ROOM_INCOMING',
                _entity: 'b44db1b4-fbb9-43ee-84f8-16fb77a84f00',
                direction: 'emitting'
            });
        });

        it('should do nothing with unknown log', () => {
            expect(parser('my strange log', 'api:info:something')).toStrictEqual({});
        });
    });

    describe('isParseable', () => {
        it('should recognize parseable logs', () => {
            expect(isParseable(prepareLog(LOGS.action).head)).toBe(true);
            expect(isParseable(prepareLog(LOGS.event).head)).toBe(true);
            expect(isParseable(prepareLog(LOGS.pcs).head)).toBe(true);
            expect(isParseable(prepareLog(LOGS.wss).head)).toBe(true);
            expect(isParseable('api:info:other')).toBe(false);
        });
    });
});
