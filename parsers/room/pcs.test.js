const { parser, isParseable } = require('./pcs');
const { prepareLog } = require('../../__test__/utils');

describe('room-pcs', () => {
    describe('parser', () => {
        const expectedResultBase = {
            parser: 'room-pcs',
            status: 'waiting',
            token: 'b596298d-070c-40e3-af53-43fcd903a5f3',
            instanceId: '8',
            serverType: '-',
            profileKey: 'audioLow',
            peerType: 'incoming',
            _entity: '1c8be699-c2e5-4180-8750-8b18ea19ac40',
            initiator: { _user: 'janusServer', _client: 'a997f9f0e8ebbc33e8e4813d941ad95b' },
            target: {
                _user: '0e804ed5-ccb6-4f02-9426-c9efa268a315',
                _client: '7bbb59b5-37a4-48c7-bda1-09160ce781aa'
            }
        };

        it('should handle correctly pcs create log', () => {
            const fullLog =
                '2022-09-16T08:07:21.256Z api:debug:pcs:room Create | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profileKey audioLow type incoming in _entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({ ...expectedResultBase, action: 'Create' });
        });

        it('should handle correctly pcs save log', () => {
            const fullLog =
                '2022-09-16T08:07:21.257Z api:debug:pcs:room Save | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profileKey audioLow type incoming in _entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({ ...expectedResultBase, action: 'Save' });
        });

        it('should handle correctly pcs remove log', () => {
            const fullLog =
                '2022-09-16T08:07:21.257Z api:debug:pcs:room Remove | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profileKey audioLow type incoming in _entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({ ...expectedResultBase, action: 'Remove' });
        });

        it('should handle correctly pcs partial save log', () => {
            const fullLog =
                '2022-09-16T08:07:21.257Z api:debug:pcs:room Partial save for: _wRTCState,updatedAt | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profileKey audioLow type incoming in _entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                ...expectedResultBase,
                action: 'Partial save for: _wRTCState,updatedAt'
            });
        });

        it('should handle correctly pcs ICE emitted log', () => {
            const fullLog =
                '2022-09-16T08:07:21.257Z api:debug:pcs:room ICE candidates emitted x2 | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profileKey audioLow type incoming in _entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                ...expectedResultBase,
                action: 'ICE candidates emitted x2'
            });
        });

        it('should handle correctly pcs ICE received log', () => {
            const fullLog =
                '2022-09-16T08:07:21.257Z api:debug:pcs:room ICE candidates received x6 | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profileKey audioLow type incoming in _entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                ...expectedResultBase,
                action: 'ICE candidates received x6'
            });
        });

        it('should handle correctly pcs SDP answer log', () => {
            const fullLog =
                '2022-09-16T08:07:21.257Z api:debug:pcs:room SDP answer ✔ | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profileKey audioLow type incoming in _entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                ...expectedResultBase,
                action: 'SDP answer ✔'
            });
        });

        it('should handle correctly pcs SDP offer log', () => {
            const fullLog =
                '2022-09-16T08:07:21.257Z api:debug:pcs:room SDP offer ✔ | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profileKey audioLow type incoming in _entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                ...expectedResultBase,
                action: 'SDP offer ✔'
            });
        });

        it('should return empty object when log is not parseable', () => {
            const fullLog = '2022-09-19T09:12:31.215Z api:info:other coucou';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({});
        });
    });

    describe('isParseable', () => {
        it('should filter head correctly', () => {
            expect(isParseable('api:info:pcs:room')).toBe(true);
            expect(isParseable('api:debug:pcs:room')).toBe(true);
            expect(isParseable('api:debug:pcs:stat')).toBe(false);
            expect(isParseable('api:debug:pcs:room:test')).toBe(false);
        });
    });
});

// 2022-09-19T09:12:31.298Z api:info:pcs-stats:room Unknown pcs, action hasn't been added | token 3d1c5779-193d-4788-9048-af3e38c631e5 action ICE_CANDIDATES_EMITTED
