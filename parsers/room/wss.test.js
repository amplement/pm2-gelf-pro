const { parser } = require('./wss');
const { prepareLog } = require('../../__test__/utils');

describe('room-wss', () => {
    describe('emitting', () => {
        it('should parse correctly ROOM_INCOMING event log', () => {
            const fullLog =
                '2022-09-19T09:12:28.718Z api:debug:wss:room ⭡ ROOM_INCOMING to _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 ip 79.91.77.197 _entity b44db1b4-fbb9-43ee-84f8-16fb77a84f00';
            const { body: log, head } = prepareLog(fullLog);
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

        it('should parse correctly ROOM_UPDATE event log', () => {
            const fullLog =
                '2022-09-19T09:12:55.349Z api:debug:wss:room ⭡ ROOM_UPDATE to _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 ip 79.91.77.197 _entity b44db1b4-fbb9-43ee-84f8-16fb77a84f00';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'ROOM_UPDATE',
                user: {
                    _user: '0e804ed5-ccb6-4f02-9426-c9efa268a315',
                    _spark: '1c8be699-c2e5-4180-8750-8b18ea19ac40'
                },
                ip: '79.91.77.197',
                _entity: 'b44db1b4-fbb9-43ee-84f8-16fb77a84f00',
                direction: 'emitting'
            });
        });

        it('should parse correctly ROOM_HANGUP event log', () => {
            const fullLog =
                '2022-09-19T09:12:58.728Z api:debug:wss:room ⭡ ROOM_HANGUP to _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 ip 79.91.77.197 _entity b596298d-070c-40e3-af53-43fcd903a5f3';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'ROOM_HANGUP',
                _entity: 'b596298d-070c-40e3-af53-43fcd903a5f3',
                user: {
                    _user: '0e804ed5-ccb6-4f02-9426-c9efa268a315',
                    _spark: '1c8be699-c2e5-4180-8750-8b18ea19ac40'
                },
                ip: '79.91.77.197',
                direction: 'emitting'
            });
        });

        it('should parse correctly ROOM_TAKEOFF event log', () => {
            const fullLog =
                '2022-09-19T09:12:30.489Z api:debug:wss:room ⭡ ROOM_TAKEOFF to _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 ip 79.91.77.197 _entity b596298d-070c-40e3-af53-43fcd903a5f3';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                _entity: 'b596298d-070c-40e3-af53-43fcd903a5f3',
                code: 'ROOM_TAKEOFF',
                user: {
                    _user: '0e804ed5-ccb6-4f02-9426-c9efa268a315',
                    _spark: '1c8be699-c2e5-4180-8750-8b18ea19ac40'
                },
                ip: '79.91.77.197',
                direction: 'emitting'
            });
        });

        it('should parse correctly ROOM_DELETE event log', () => {
            const fullLog =
                "api:debug:wss:room ⭡ ROOM_DELETE to _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 ip 82.66.194.214 _entity d1859197-5e84-4861-9025-0972e25a7bcd { id: 'd1859197-5e84-4861-9025-0972e25a7bcd', isVar: true } +0ms";
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'ROOM_DELETE',
                user: {
                    _user: '0e804ed5-ccb6-4f02-9426-c9efa268a315',
                    _spark: '1c8be699-c2e5-4180-8750-8b18ea19ac40'
                },
                ip: '82.66.194.214',
                _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd',
                direction: 'emitting'
            });
        });

        it('should parse correctly WRTC_SDP_ANSWER event log', () => {
            const fullLog =
                '2022-09-19T09:12:30.871Z api:debug:wss:wrtc ⭡ WRTC_SDP_ANSWER to _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 ip 79.91.77.197 _entity 9038f83c-598a-4343-9f9d-84de1a0c048c';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'WRTC_SDP_ANSWER',
                user: {
                    _client: '7bbb59b5-37a4-48c7-bda1-09160ce781aa',
                    _spark: '1c8be699-c2e5-4180-8750-8b18ea19ac40'
                },
                ip: '79.91.77.197',
                _entity: '9038f83c-598a-4343-9f9d-84de1a0c048c',
                direction: 'emitting'
            });
        });

        it('should parse correctly WRTC_SDP_OFFER event log', () => {
            const fullLog =
                '2022-09-19T09:12:30.705Z api:debug:wss:wrtc ⭡ WRTC_SDP_OFFER to _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 ip 79.91.77.197 _entity b44db1b4-fbb9-43ee-84f8-16fb77a84f00';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'WRTC_SDP_OFFER',
                user: {
                    _client: '7bbb59b5-37a4-48c7-bda1-09160ce781aa',
                    _spark: '1c8be699-c2e5-4180-8750-8b18ea19ac40'
                },
                ip: '79.91.77.197',
                _entity: 'b44db1b4-fbb9-43ee-84f8-16fb77a84f00',
                direction: 'emitting'
            });
        });

        it('should parse correctly WRTC_PC_CLOSE event log', () => {
            const fullLog =
                'api:debug:wss:wrtc ⭡ WRTC_PC_CLOSE to _client 8b5a72de-0adb-411f-9597-5f646221f646 _spark fa45db0b-65b0-4f17-91e6-01b978ea129c ip 78.119.123.160 _entity a0837aae-71cf-45e2-8e10-e0c48d818623';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                _entity: 'a0837aae-71cf-45e2-8e10-e0c48d818623',
                user: {
                    _client: '8b5a72de-0adb-411f-9597-5f646221f646',
                    _spark: 'fa45db0b-65b0-4f17-91e6-01b978ea129c'
                },
                ip: '78.119.123.160',
                code: 'WRTC_PC_CLOSE',
                direction: 'emitting'
            });
        });
    });
    describe('receiving', () => {
        it('should parse correctly WRTC_ICE_CANDIDATES event log', () => {
            const fullLog =
                '2022-09-19T09:12:31.288Z api:info:wss:wrtc ⭣ WRTC_ICE_CANDIDATES from _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa device web ip 79.91.77.197 _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 _entity b596298d-070c-40e3-af53-43fcd903a5f3';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                _entity: 'b596298d-070c-40e3-af53-43fcd903a5f3',
                user: {
                    _user: '0e804ed5-ccb6-4f02-9426-c9efa268a315',
                    _client: '7bbb59b5-37a4-48c7-bda1-09160ce781aa',
                    _spark: '1c8be699-c2e5-4180-8750-8b18ea19ac40'
                },
                device: 'web',
                ip: '79.91.77.197',
                code: 'WRTC_ICE_CANDIDATES',
                direction: 'receiving'
            });
        });

        it('should parse correctly WRTC_CONNECTION_STATE_CHANGE event log', () => {
            const fullLog =
                '2022-09-19T09:12:31.220Z api:info:wss:wrtc ⭣ WRTC_CONNECTION_STATE_CHANGE from _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa device web ip 79.91.77.197 _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 _entity b596298d-070c-40e3-af53-43fcd903a5f3';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                _entity: 'b596298d-070c-40e3-af53-43fcd903a5f3',
                user: {
                    _user: '0e804ed5-ccb6-4f02-9426-c9efa268a315',
                    _client: '7bbb59b5-37a4-48c7-bda1-09160ce781aa',
                    _spark: '1c8be699-c2e5-4180-8750-8b18ea19ac40'
                },
                device: 'web',
                ip: '79.91.77.197',
                code: 'WRTC_CONNECTION_STATE_CHANGE',
                direction: 'receiving'
            });
        });

        it('should parse correctly WRTC_ICE_CONNECTION_STATE_CHANGE event log', () => {
            const fullLog =
                '2022-09-19T09:12:31.215Z api:info:wss:wrtc ⭣ WRTC_ICE_CONNECTION_STATE_CHANGE from _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa device web ip 79.91.77.197 _spark 1c8be699-c2e5-4180-8750-8b18ea19ac40 _entity b596298d-070c-40e3-af53-43fcd903a5f3';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                _entity: 'b596298d-070c-40e3-af53-43fcd903a5f3',
                user: {
                    _user: '0e804ed5-ccb6-4f02-9426-c9efa268a315',
                    _client: '7bbb59b5-37a4-48c7-bda1-09160ce781aa',
                    _spark: '1c8be699-c2e5-4180-8750-8b18ea19ac40'
                },
                device: 'web',
                ip: '79.91.77.197',
                code: 'WRTC_ICE_CONNECTION_STATE_CHANGE',
                direction: 'receiving'
            });
        });
    });
});
