const { parser, isParseable } = require('./index');
const { prepareLog } = require('../../__test__/utils');

const LOGS = {
    service: 'api:debug:service:room Removing all PCS | _entity d1859197-5e84-4861-9025-0972e25a7bcd +23m',
    event: 'api:debug:event:room Unicast room with only one responder, deleting | _entity d1859197-5e84-4861-9025-0972e25a7bcd',
    pcs: '2022-09-16T08:07:21.256Z api:debug:pcs:room Create | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in _entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa',
    wss: '2022-09-19T09:12:28.718Z api:debug:wss:room ⭡ ROOM_INCOMING to _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 ip 79.91.77.197 _entity b44db1b4-fbb9-43ee-84f8-16fb77a84f00',
    pcsStats:
        '2022-09-19T09:12:28.718Z api:debug:pcs-stats:room Created | token 02010338-170f-40ee-814d-fdc41db86d53 _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5',
    http: '2022-09-30T07:39:00.759Z api:debug:http:room Join request for _user 04271c85-7963-4b7f-aded-35ceb8b2ce3a _client f2275181-9b6a-4a9d-bdca-96d432aebe6b | _entity d4994ffa-e2d6-4fd3-b747-30abad7e399b'
};

describe('room parsers index', () => {
    describe('parser', () => {
        it('should handle service log correctly', () => {
            const { head, body: log } = prepareLog(LOGS.service);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-service',
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

        it('should handle correctly pcs stats log', () => {
            const { head, body: log } = prepareLog(LOGS.pcsStats);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-pcs-stats',
                token: '02010338-170f-40ee-814d-fdc41db86d53',
                _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5'
            });
        });

        it('should handle http room event', () => {
            const { head, body: log } = prepareLog(LOGS.http);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-http',
                _user: '04271c85-7963-4b7f-aded-35ceb8b2ce3a',
                _entity: 'd4994ffa-e2d6-4fd3-b747-30abad7e399b',
                _client: 'f2275181-9b6a-4a9d-bdca-96d432aebe6b'
            });
        });

        it('should do nothing with unknown log', () => {
            expect(parser('my strange log', 'api:info:something')).toStrictEqual({});
        });
    });

    describe('isParseable', () => {
        it('should recognize parseable logs', () => {
            expect(isParseable(prepareLog(LOGS.service).head)).toBe(true);
            expect(isParseable(prepareLog(LOGS.event).head)).toBe(true);
            expect(isParseable(prepareLog(LOGS.pcs).head)).toBe(true);
            expect(isParseable(prepareLog(LOGS.wss).head)).toBe(true);
            expect(isParseable('api:info:other')).toBe(false);
        });
    });
});
