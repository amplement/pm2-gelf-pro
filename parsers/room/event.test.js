const { parser } = require('./event');
const { prepareLog } = require('../../__test__/utils');

describe('room-event', () => {
    it('should handle correctly room creation event log', () => {
        const fullLog =
            '2022-09-16T08:03:38.221Z api:debug:event:room Room created for incoming call for userUri 503349001000@85.118.42.49 handleId 6759526312052396 sessionId 1336608306141737 | _entity 80648f9d-52ba-4e0a-8d3c-db06b6ba83ca';
        const { body: log, head } = prepareLog(fullLog);
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

    it('should handle correctly deleting unicast with one responder event log', () => {
        const fullLog =
            'api:debug:event:room Unicast room with only one responder, deleting | _entity d1859197-5e84-4861-9025-0972e25a7bcd';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd',
            parser: 'room-event'
        });
    });

    it('should handle correctly room deletion event log', () => {
        const fullLog =
            'api:debug:event:room Deleted, emitting to _users 44ee020c-6573-4758-a59c-8c2f3b6cb765,janusServer | _entity d1859197-5e84-4861-9025-0972e25a7bcd';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd',
            parser: 'room-event'
        });
    });

    it('should handle correctly release call dispatch event log', () => {
        const fullLog =
            'api:debug:event:room Deleted, dispatching release call for _user janusServer _client 5ceeceaa94acde33f1e477527c2ba5e9 handleId 7474820413626979 sessionId 7317450467758507 instanceId 1 | _entity 0314b63d-5959-4781-9ec0-2eb5d940ab95';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: '0314b63d-5959-4781-9ec0-2eb5d940ab95',
            target: { _user: 'janusServer', _client: '5ceeceaa94acde33f1e477527c2ba5e9' },
            callData: { handleId: '7474820413626979', sessionId: '7317450467758507' },
            instanceId: '1',
            parser: 'room-event'
        });
    });

    it('should handle correctly incoming sip call event log', () => {
        const fullLog =
            'api:debug:event:room Incoming call for userUri 500100903325@85.118.42.49 handleId 3322919249302882 sessionId 8463688690273227 | _entity -';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            callData: {
                userUri: '500100903325@85.118.42.49',
                handleId: '3322919249302882',
                sessionId: '8463688690273227'
            },
            parser: 'room-event'
        });
    });

    it('should handle correctly missed incoming call SIP event log', () => {
        const fullLog =
            'api:debug:event:room Missed incoming call | userUri 500100903325@85.118.42.49 handleId 3322919249302882 sessionId 8463688690273227 | _entity -';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            callData: {
                userUri: '500100903325@85.118.42.49',
                handleId: '3322919249302882',
                sessionId: '8463688690273227'
            },
            parser: 'room-event'
        });
    });

    it('should handle correctly missed incoming call event log', () => {
        const fullLog =
            'api:debug:event:room Missed incoming call | _user 44ee020c-6573-4758-a59c-8c2f3b6cb765 is in the room. HIT | _entity d10f5d9b-89c4-434a-9f9d-22056532e642 +23ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'd10f5d9b-89c4-434a-9f9d-22056532e642',
            target: { _user: '44ee020c-6573-4758-a59c-8c2f3b6cb765' },
            parser: 'room-event'
        });
    });

    it('should handle correctly janus join room event log', () => {
        const fullLog =
            'api:debug:event:room Users janusServer joined the room | _entity 0314b63d-5959-4781-9ec0-2eb5d940ab95';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: '0314b63d-5959-4781-9ec0-2eb5d940ab95',
            parser: 'room-event'
        });
    });

    it('should handle correctly janus join room dispatch event log', () => {
        const fullLog =
            'api:debug:event:room users janusServer joined the room emitting update to _users f10bcd85-3c6d-46b0-9039-db4d42469f14,janusServer | _entity 0314b63d-5959-4781-9ec0-2eb5d940ab95';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: '0314b63d-5959-4781-9ec0-2eb5d940ab95',
            parser: 'room-event'
        });
    });

    it('should handle correctly user leave room event log', () => {
        const fullLog =
            'api:debug:event:room Users janusServer leaving the room | _entity d1859197-5e84-4861-9025-0972e25a7bcd';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd',
            parser: 'room-event'
        });
    });

    it('should handle correctly user join room dispatch event log', () => {
        const fullLog =
            'api:debug:event:room users f10bcd85-3c6d-46b0-9039-db4d42469f14 joined the room emitting update to _users f10bcd85-3c6d-46b0-9039-db4d42469f14,44ee020c-6573-4758-a59c-8c2f3b6cb765 | _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5',
            parser: 'room-event'
        });
    });

    it('should handle correctly janus create room event log', () => {
        const fullLog =
            'api:debug:event:room Room created by janusServer | _entity d1859197-5e84-4861-9025-0972e25a7bcd';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd',
            parser: 'room-event'
        });
    });

    it('should handle correctly media event log', () => {
        const fullLog =
            'api:debug:event:room media event received for _user 44ee020c-6573-4758-a59c-8c2f3b6cb765 userUri 500100903325@85.118.42.49 with receiving true | _entity d1859197-5e84-4861-9025-0972e25a7bcd';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd',
            callData: { userUri: '500100903325@85.118.42.49' },
            target: { _user: '44ee020c-6573-4758-a59c-8c2f3b6cb765' },
            receiving: true,
            parser: 'room-event'
        });
    });

    it('should handle correctly media event with N/A as receiving value log', () => {
        const fullLog =
            'api:debug:event:room media event received for _user 44ee020c-6573-4758-a59c-8c2f3b6cb765 userUri 500100903325@85.118.42.49 with receiving N/A | _entity d1859197-5e84-4861-9025-0972e25a7bcd';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd',
            callData: { userUri: '500100903325@85.118.42.49' },
            target: { _user: '44ee020c-6573-4758-a59c-8c2f3b6cb765' },
            receiving: false,
            parser: 'room-event'
        });
    });

    it('should handle correctly everybody is already notified event log', () => {
        const fullLog =
            'api:debug:event:room Everybody have already been notified | _entity 0314b63d-5959-4781-9ec0-2eb5d940ab95';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: '0314b63d-5959-4781-9ec0-2eb5d940ab95',
            parser: 'room-event'
        });
    });

    it('should handle correctly outgoing is ringing event log', () => {
        const fullLog =
            '2022-09-16T12:52:53.590Z api:debug:event:room Outgoing call is ringing | _entity c74bc5fe-aa97-4f50-a451-639af886e7f4';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'c74bc5fe-aa97-4f50-a451-639af886e7f4',
            parser: 'room-event'
        });
    });

    it('should handle correctly hangup outgoing call event log', () => {
        const fullLog =
            'api:debug:event:room Hangup outgoing call | _user f10bcd85-3c6d-46b0-9039-db4d42469f14 _client 02191afe-9b3a-4fda-96ab-7331b5a0868d rejection with entity but no origin (transfer) | Kicking _user f10bcd85-3c6d-46b0-9039-db4d42469f14 | _entity 0314b63d-5959-4781-9ec0-2eb5d940ab95 +0ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: '0314b63d-5959-4781-9ec0-2eb5d940ab95',
            target: {
                _user: 'f10bcd85-3c6d-46b0-9039-db4d42469f14',
                _client: '02191afe-9b3a-4fda-96ab-7331b5a0868d'
            },
            parser: 'room-event'
        });
    });

    it('should handle correctly request for hangup outgoing call event log', () => {
        const fullLog =
            'api:debug:event:room Hangup outgoing call | request for hangup call with _user f10bcd85-3c6d-46b0-9039-db4d42469f14 _client 02191afe-9b3a-4fda-96ab-7331b5a0868d | _entity 0314b63d-5959-4781-9ec0-2eb5d940ab95';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: '0314b63d-5959-4781-9ec0-2eb5d940ab95',
            target: {
                _user: 'f10bcd85-3c6d-46b0-9039-db4d42469f14',
                _client: '02191afe-9b3a-4fda-96ab-7331b5a0868d'
            },
            parser: 'room-event'
        });
    });

    it('should handle correctly hangup incoming call event log', () => {
        const fullLog =
            '2022-09-16T14:17:21.673Z api:debug:event:room Hangup incoming call: call has been hangup after having been answered (250s) | Remove Janus handleId 8688259274247729 sessionId 5412674879490465 | _entity ababdb7f-dda4-4dd4-b365-229481675652';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'ababdb7f-dda4-4dd4-b365-229481675652',
            callData: {
                handleId: '8688259274247729',
                sessionId: '5412674879490465'
            },
            parser: 'room-event'
        });
    });

    it('should handle correctly subscriber hangup who remove a pcs event log', () => {
        const fullLog =
            'api:debug:event:room Subscriber hangup | between _user f10bcd85-3c6d-46b0-9039-db4d42469f14 _client f65d2230-6fc7-41c5-8d99-22847f927af2 and _user f10bcd85-3c6d-46b0-9039-db4d42469f14 _client a469f638-6779-41bb-8ede-949f56cce5b7 token 382f83b8-8f3a-4870-932c-0e1719934d27 profileKey videoLow | removing PCS | _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5',
            initiator: {
                _user: 'f10bcd85-3c6d-46b0-9039-db4d42469f14',
                _client: 'f65d2230-6fc7-41c5-8d99-22847f927af2'
            },
            target: {
                _user: 'f10bcd85-3c6d-46b0-9039-db4d42469f14',
                _client: 'a469f638-6779-41bb-8ede-949f56cce5b7'
            },
            profileKey: 'videoLow',
            token: '382f83b8-8f3a-4870-932c-0e1719934d27',
            parser: 'room-event'
        });
    });

    it('should handle correctly subscriber hangup event log', () => {
        const fullLog =
            'api:debug:event:room Subscriber hangup | between _client f65d2230-6fc7-41c5-8d99-22847f927af2 and _client a469f638-6779-41bb-8ede-949f56cce5b7 profileKey videoLow | _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5',
            initiator: { _client: 'f65d2230-6fc7-41c5-8d99-22847f927af2' },
            target: { _client: 'a469f638-6779-41bb-8ede-949f56cce5b7' },
            profileKey: 'videoLow',
            parser: 'room-event'
        });
    });

    it('should handle correctly focus stacking event log', () => {
        const fullLog =
            '2022-09-16T14:32:04.507Z api:debug:event:room Client focus processing - targeted publisher not ready (stacking) | _user 42f8d68e-3f0b-4316-a7b0-e508f4a1e7db _client da584607-3c79-4444-a00c-4748bb3d681c _targetedClient f2aa512b-ac4d-4896-b6e0-eef7fe53404c | _entity f8632f06-0f15-4901-bd90-fc7444adcd11';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'f8632f06-0f15-4901-bd90-fc7444adcd11',
            initiator: {
                _user: '42f8d68e-3f0b-4316-a7b0-e508f4a1e7db',
                _client: 'da584607-3c79-4444-a00c-4748bb3d681c'
            },
            target: {
                _client: 'f2aa512b-ac4d-4896-b6e0-eef7fe53404c'
            },
            parser: 'room-event'
        });
    });

    it('should handle correctly publisher ready event log', () => {
        const fullLog =
            'api:debug:event:room High publisher ready | between _user f10bcd85-3c6d-46b0-9039-db4d42469f14 _client f65d2230-6fc7-41c5-8d99-22847f927af2 and _user janus _client janus token 934c2242-e2e8-48a9-9ffc-84f49d4d096a profileKey videoHigh | _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5',
            token: '934c2242-e2e8-48a9-9ffc-84f49d4d096a',
            profileKey: 'videoHigh',
            initiator: {
                _user: 'f10bcd85-3c6d-46b0-9039-db4d42469f14',
                _client: 'f65d2230-6fc7-41c5-8d99-22847f927af2'
            },
            target: {
                _user: 'janus',
                _client: 'janus'
            },
            parser: 'room-event'
        });
    });

    it('should handle correctly publisher ready message event log', () => {
        const fullLog =
            'api:debug:event:room Publisher ready | between _user f10bcd85-3c6d-46b0-9039-db4d42469f14 _client f65d2230-6fc7-41c5-8d99-22847f927af2 and _user janus _client janus token 77c36dac-fe48-406c-a499-5c91aec7bd94 profileKey videoLow | _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5',
            token: '77c36dac-fe48-406c-a499-5c91aec7bd94',
            profileKey: 'videoLow',
            initiator: {
                _user: 'f10bcd85-3c6d-46b0-9039-db4d42469f14',
                _client: 'f65d2230-6fc7-41c5-8d99-22847f927af2'
            },
            target: {
                _user: 'janus',
                _client: 'janus'
            },
            parser: 'room-event'
        });
    });

    it('should handle correctly responder property change event log', () => {
        const fullLog =
            "api:debug:event:room Responder property 'video' changed to true for _user f10bcd85-3c6d-46b0-9039-db4d42469f14 with _client d5c459c3-3979-43db-af74-dc55156f2e46 | _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5 +6s";
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5',
            initiator: {
                _user: 'f10bcd85-3c6d-46b0-9039-db4d42469f14',
                _client: 'd5c459c3-3979-43db-af74-dc55156f2e46'
            },
            parser: 'room-event'
        });
    });

    it('should handle correctly responder property change dispatch event log', () => {
        const fullLog =
            'api:debug:event:room Responder property changed, emitting update to _users f10bcd85-3c6d-46b0-9039-db4d42469f14,44ee020c-6573-4758-a59c-8c2f3b6cb765 | _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5',
            parser: 'room-event'
        });
    });

    it('should return empty object when log is not parseable', () => {
        const fullLog = '2022-09-19T09:12:31.215Z api:info:other coucou';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({});
    });
});
