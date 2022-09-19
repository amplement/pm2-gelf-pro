const { parseHead } = require('../index');
const { removeColorCharacters, removeDate } = require('../../utils');
const { parser } = require('./wss');

function prepareLog(log) {
    return parseHead(removeColorCharacters(removeDate(log)));
}

describe('wss', () => {
    describe('emitting', () => {
        it('should parse correctly ROOM_INCOMING event log', () => {
            const fullLog =
                '2022-09-19T09:12:28.718Z api:debug:wss:room ⭡ ROOM_INCOMING to _client d92e _spark b3b9 79.91.77.197 _room b44db1b4-fbb9-43ee-84f8-16fb77a84f00';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'ROOM_INCOMING',
                _entity: 'b44db1b4-fbb9-43ee-84f8-16fb77a84f00',
                direction: 'emitting'
            });
        });

        it('should parse correctly ROOM_UPDATE event log', () => {
            const fullLog =
                '2022-09-19T09:12:55.349Z api:debug:wss:room ⭡ ROOM_UPDATE to _user 0855 _spark b3b9 79.91.77.197 _room b44db1b4-fbb9-43ee-84f8-16fb77a84f00';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'ROOM_UPDATE',
                _entity: 'b44db1b4-fbb9-43ee-84f8-16fb77a84f00',
                direction: 'emitting'
            });
        });

        it('should parse correctly ROOM_HANGUP event log', () => {
            const fullLog =
                '2022-09-19T09:12:58.728Z api:debug:wss:room ⭡ ROOM_HANGUP to _user 0855 _spark b3b9 79.91.77.197 _room -';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'ROOM_HANGUP',
                _entity: '-',
                direction: 'emitting'
            });
        });

        it('should parse correctly ROOM_TAKEOFF event log', () => {
            const fullLog =
                '2022-09-19T09:12:30.489Z api:debug:wss:room ⭡ ROOM_TAKEOFF to _user 0855 _spark b3b9 79.91.77.197 _room -';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                _entity: '-',
                code: 'ROOM_TAKEOFF',
                direction: 'emitting'
            });
        });

        it('should parse correctly ROOM_DELETE event log', () => {
            const fullLog =
                '2022-09-19T09:12:58.856Z api:debug:wss:room ⭡ ROOM_DELETE to _user eb2a _spark 79e1 79.91.77.197 _room 9038f83c-598a-4343-9f9d-84de1a0c048c';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'ROOM_DELETE',
                _entity: '9038f83c-598a-4343-9f9d-84de1a0c048c',
                direction: 'emitting'
            });
        });

        it('should parse correctly WRTC_SDP_ANSWER event log', () => {
            const fullLog =
                '2022-09-19T09:12:30.871Z api:debug:wss:wrtc ⭡ WRTC_SDP_ANSWER to _client 8527 _spark 32d7 79.91.77.197 _room 9038f83c-598a-4343-9f9d-84de1a0c048c';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'WRTC_SDP_ANSWER',
                _entity: '9038f83c-598a-4343-9f9d-84de1a0c048c',
                direction: 'emitting'
            });
        });

        it('should parse correctly WRTC_SDP_OFFER event log', () => {
            const fullLog =
                '2022-09-19T09:12:30.705Z api:debug:wss:wrtc ⭡ WRTC_SDP_OFFER to _client d92e _spark b3b9 79.91.77.197 _room b44db1b4-fbb9-43ee-84f8-16fb77a84f00';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                code: 'WRTC_SDP_OFFER',
                _entity: 'b44db1b4-fbb9-43ee-84f8-16fb77a84f00',
                direction: 'emitting'
            });
        });
    });
    describe('receiving', () => {
        it('should parse correctly WRTC_ICE_CANDIDATES event log', () => {
            const fullLog =
                '2022-09-19T09:12:31.288Z api:info:wss:wrtc ⭣ WRTC_ICE_CANDIDATES from _user 0855 _client d92e device web 79.91.77.197 _spark b3b9';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                _entity: '-',
                code: 'WRTC_ICE_CANDIDATES',
                direction: 'receiving'
            });
        });

        it('should parse correctly WRTC_CONNECTION_STATE_CHANGE event log', () => {
            const fullLog =
                '2022-09-19T09:12:31.220Z api:info:wss:wrtc ⭣ WRTC_CONNECTION_STATE_CHANGE from _user eb2a _client 8527 device web 79.91.77.197 _spark 32d7';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                _entity: '-',
                code: 'WRTC_CONNECTION_STATE_CHANGE',
                direction: 'receiving'
            });
        });

        it('should parse correctly WRTC_ICE_CONNECTION_STATE_CHANGE event log', () => {
            const fullLog =
                '2022-09-19T09:12:31.215Z api:info:wss:wrtc ⭣ WRTC_ICE_CONNECTION_STATE_CHANGE from _user eb2a _client 8527 device web 79.91.77.197 _spark 32d7';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'room-wss',
                _entity: '-',
                code: 'WRTC_ICE_CONNECTION_STATE_CHANGE',
                direction: 'receiving'
            });
        });
    });
});
