const { parser, isParseable } = require('./index');
const { prepareLog } = require('../../__test__/utils');

const LOGS = {
    action: 'api:debug:action:room Removing all PCS | _entity d1859197-5e84-4861-9025-0972e25a7bcd +23m',
    event: 'api:debug:event:room Unicast room with only one responder, deleting | _entity d1859197-5e84-4861-9025-0972e25a7bcd',
    pcs: '2022-09-16T08:07:21.256Z api:debug:pcs:room Create | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in _entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa',
    wss: '2022-09-19T09:12:28.718Z api:debug:wss:room ⭡ ROOM_INCOMING to _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 ip 79.91.77.197 _entity b44db1b4-fbb9-43ee-84f8-16fb77a84f00'
};

describe('room parsers index', () => {
    describe('parser', () => {
        it('should handle action log correctly', () => {
            const { head, body: log } = prepareLog(LOGS.action);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-action',
                _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd'
            });
        });

        it('should handle event log correctly', () => {
            const { head, body: log } = prepareLog(LOGS.event);
            expect(parser(log, head)).toStrictEqual({
                _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd',
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
                user: {
                    _client: '7bbb59b5-37a4-48c7-bda1-09160ce781aa',
                    _spark: '1c8be699-c2e5-4180-8750-8b18ea19ac40'
                },
                ip: '79.91.77.197',
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
