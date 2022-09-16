const { removeColorCharacters, removeDate } = require('../../utils');
const { parseHead } = require('../index');
const { parser } = require('./PCS');

function prepareLog(log) {
    return parseHead(removeColorCharacters(removeDate(log)));
}

describe('PCS', () => {
    const expectedResultBase = {
        status: 'waiting',
        action: 'SDP offer ✔',
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
        }
    };
    it('should handle correctly pcs create log', () => {
        const fullLog =
            '2022-09-16T08:07:21.256Z api:debug:pcs:room Create | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({ ...expectedResultBase, action: 'Create' });
    });

    it('should handle correctly pcs save log', () => {
        const fullLog =
            '2022-09-16T08:07:21.257Z api:debug:pcs:room Save | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({ ...expectedResultBase, action: 'Save' });
    });

    it('should handle correctly pcs remove log', () => {
        const fullLog =
            '2022-09-16T08:07:21.257Z api:debug:pcs:room Remove | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({ ...expectedResultBase, action: 'Remove' });
    });

    it('should handle correctly pcs partial save log', () => {
        const fullLog =
            '2022-09-16T08:07:21.257Z api:debug:pcs:room Partial save for: _wRTCState,updatedAt | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            ...expectedResultBase,
            action: 'Partial save for: _wRTCState,updatedAt'
        });
    });

    it('should handle correctly pcs ICE emitted log', () => {
        const fullLog =
            '2022-09-16T08:07:21.257Z api:debug:pcs:room ICE candidates emitted x2 | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            ...expectedResultBase,
            action: 'ICE candidates emitted x2'
        });
    });

    it('should handle correctly pcs ICE received log', () => {
        const fullLog =
            '2022-09-16T08:07:21.257Z api:debug:pcs:room ICE candidates received x6 | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            ...expectedResultBase,
            action: 'ICE candidates received x6'
        });
    });

    it('should handle correctly pcs SDP answer log', () => {
        const fullLog =
            '2022-09-16T08:07:21.257Z api:debug:pcs:room SDP answer ✔ | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            ...expectedResultBase,
            action: 'SDP answer ✔'
        });
    });

    it('should handle correctly pcs SDP offer log', () => {
        const fullLog =
            '2022-09-16T08:07:21.257Z api:debug:pcs:room SDP offer ✔ | status waiting token b596298d-070c-40e3-af53-43fcd903a5f3 instanceId 8 serverType - profile audioLow type incoming in entity 1c8be699-c2e5-4180-8750-8b18ea19ac40 between _user janusServer _client a997f9f0e8ebbc33e8e4813d941ad95b and _user 0e804ed5-ccb6-4f02-9426-c9efa268a315 _client 7bbb59b5-37a4-48c7-bda1-09160ce781aa';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            ...expectedResultBase,
            action: 'SDP offer ✔'
        });
    });
});

// other
// 2022-09-16T08:03:38.015Z api:debug:action:room Removing all pcs of the entity 26a33568-129c-4a68-9c82-0fec054b03e2 | _room 26a33568-129c-4a68-9c82-0fec054b03e2

// event
// 2022-09-16T08:03:38.221Z api:debug:event:room Room created for incoming call for userUri 503349001000@85.118.42.49 handleId 6759526312052396 sessionId 1336608306141737 | _room 80648f9d-52ba-4e0a-8d3c-db06b6ba83ca
// 2022-09-16T08:03:38.207Z api:debug:event:room Incoming call for userUri 503349001000@85.118.42.49 handleId 6759526312052396 sessionId 1336608306141737 | _room -
// 2022-09-16T08:03:38.015Z api:debug:event:room Deleted, emitting to _users ccbe9da5-129b-4e8c-ae2b-de6b306e6a7d,janusServer | _room 26a33568-129c-4a68-9c82-0fec054b03e2
// 2022-09-16T08:03:38.015Z api:debug:event:room Deleted, dispatching release call for _user janusServer _client 3a43f6b16339f299be35393d5a886380 handleId 5245059656032917 sessionId 239292819169021 instanceId 3 | _room 26a33568-129c-4a68-9c82-0fec054b03e2
