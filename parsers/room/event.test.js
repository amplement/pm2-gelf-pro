const { removeColorCharacters, removeDate } = require('../../utils');
const { parseHead } = require('../index');
const { parser } = require('./event');

function prepareLog(log) {
    return parseHead(removeColorCharacters(removeDate(log)));
}

describe('event', () => {
    it('should handle correctly room creation event log', () => {
        const fullLog =
            '2022-09-16T08:03:38.221Z api:debug:event:room Room created for incoming call for userUri 503349001000@85.118.42.49 handleId 6759526312052396 sessionId 1336608306141737 | _room 80648f9d-52ba-4e0a-8d3c-db06b6ba83ca';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            callData: {
                userUri: '503349001000@85.118.42.49',
                handleId: '6759526312052396',
                sessionId: '1336608306141737'
            }, _entity: '80648f9d-52ba-4e0a-8d3c-db06b6ba83ca'
        });
    });

    it('should handle correctly room deletion event log', () => {
        const fullLog =
            '2022-09-16T08:03:38.015Z api:debug:event:room Deleted, emitting to _users ccbe9da5-129b-4e8c-ae2b-de6b306e6a7d,janusServer | _room 26a33568-129c-4a68-9c82-0fec054b03e2';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({ _entity: '26a33568-129c-4a68-9c82-0fec054b03e2' });
    });

    it('should handle correctly release call dispatch event log', () => {
        const fullLog =
            '2022-09-16T08:03:38.015Z api:debug:event:room Deleted, dispatching release call for _user janusServer _client 3a43f6b16339f299be35393d5a886380 handleId 5245059656032917 sessionId 239292819169021 instanceId 3 | _room 26a33568-129c-4a68-9c82-0fec054b03e2';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: '26a33568-129c-4a68-9c82-0fec054b03e2',
            target: { _user: 'janusServer', _client: '3a43f6b16339f299be35393d5a886380' },
            callData: { handleId: '5245059656032917', sessionId: '239292819169021' },
            instanceId: '3'
        });
    });

    it('should handle correctly incoming sip call event log', () => {
        const fullLog =
            '2022-09-16T08:03:38.207Z api:debug:event:room Incoming call for userUri 503349001000@85.118.42.49 handleId 6759526312052396 sessionId 1336608306141737 | _room -';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            callData: {
                userUri: '503349001000@85.118.42.49',
                handleId: '6759526312052396',
                sessionId: '1336608306141737'
            }
        });
    });

    it('should handle correctly missed incoming call SIP event log', () => {
        const fullLog =
            '2022-09-16T12:52:58.832Z api:debug:event:room Missed incoming call: userUri 503162101000@85.118.42.49 with handle 5416656560042755 | _room -';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            callData: {
                userUri: '503162101000@85.118.42.49',
                handleId: '5416656560042755'
            }
        });
    });

    it('should handle correctly missed incoming call event log', () => {
        const fullLog =
            '2022-09-16T12:52:57.355Z api:debug:event:room Missed incoming call: user 9b351640-78be-489f-a1a5-acf10ee700e8 is in the room. HIT | _room 420ccecc-e061-40be-887d-8604796c45fd';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: '420ccecc-e061-40be-887d-8604796c45fd',
            target: { _user: '9b351640-78be-489f-a1a5-acf10ee700e8' }
        });
    });

    it('should handle correctly janus join room event log', () => {
        const fullLog =
            '2022-09-16T12:52:56.393Z api:debug:event:room Users janusServer joined the room | _room b839773f-8651-4d9e-974b-16b8ac75733f';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'b839773f-8651-4d9e-974b-16b8ac75733f'
        });
    });

    it('should handle correctly janus join room dispatch event log', () => {
        const fullLog =
            '2022-09-16T12:52:56.011Z api:debug:event:room users janusServer joined the room emitting update to _users 14388536-0648-467f-9897-a9507535bb13,janusServer | _room 114dff3b-6f4d-4e26-ab21-f85cd735c155';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: '114dff3b-6f4d-4e26-ab21-f85cd735c155',
        });
    });

    it('should handle correctly user join room dispatch event log', () => {
        const fullLog =
            '2022-09-16T12:52:52.390Z api:debug:event:room users f7295d59-57d9-4dc4-813a-6c39ee8c1f15 joined the room emitting update to _users f7295d59-57d9-4dc4-813a-6c39ee8c1f15,janusServer | _room c74bc5fe-aa97-4f50-a451-639af886e7f4';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'c74bc5fe-aa97-4f50-a451-639af886e7f4',
        });
    });

    it('should handle correctly janus create room event log', () => {
        const fullLog =
            '2022-09-16T12:52:55.984Z api:debug:event:room Room created by janusServer | _room a66faeb6-57e9-454f-8566-f271812532a2';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'a66faeb6-57e9-454f-8566-f271812532a2'
        });
    });

    it('should handle correctly media event log', () => {
        const fullLog =
            '2022-09-16T12:52:53.920Z api:debug:event:room media event received for user f7295d59-57d9-4dc4-813a-6c39ee8c1f15 with receiving true | _room c74bc5fe-aa97-4f50-a451-639af886e7f4';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'c74bc5fe-aa97-4f50-a451-639af886e7f4',
            target: { _user: 'f7295d59-57d9-4dc4-813a-6c39ee8c1f15'}
        });
    });

    it('should handle correctly everybody is already notified event log', () => {
        const fullLog =
            '2022-09-16T12:52:53.620Z api:debug:event:room Everybody have already been notified | _room c74bc5fe-aa97-4f50-a451-639af886e7f4';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'c74bc5fe-aa97-4f50-a451-639af886e7f4',
        });
    });

    it('should handle correctly outgoing is ringing event log', () => {
        const fullLog =
            '2022-09-16T12:52:53.590Z api:debug:event:room Outgoing call is ringing | _room c74bc5fe-aa97-4f50-a451-639af886e7f4';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'c74bc5fe-aa97-4f50-a451-639af886e7f4',
        });
    });

    it('should handle correctly hangup outgoing call event log', () => {
        const fullLog =
            '2022-09-16T12:52:34.574Z api:debug:event:room Hangup outgoing call: call with callerId: 04271c85-7963-4b7f-aded-35ceb8b2ce3a _client: bc777b35-b75d-4ba4-a6c5-2c5ab7d7eea6 rejection with entity but no origin (transfer). Kicking user 04271c85-7963-4b7f-aded-35ceb8b2ce3a | _room 9737f38d-499f-4d54-aab8-9e6f7f564875';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: '9737f38d-499f-4d54-aab8-9e6f7f564875',
            target: { _user: '04271c85-7963-4b7f-aded-35ceb8b2ce3a'}
        });
    });

    it('should handle correctly hangup incoming call event log', () => {
        const fullLog =
            '2022-09-16T14:17:21.673Z api:debug:event:room Hangup incoming call: call has been hangup after having been answered (250s). Remove Janus handle/session 8688259274247729/5412674879490465 | _room ababdb7f-dda4-4dd4-b365-229481675652';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'ababdb7f-dda4-4dd4-b365-229481675652',
            callData: {
                handleId: '8688259274247729',
                sessionId: '5412674879490465'
            }
        });
    });

    it('should handle correctly subscriber janus hangup event log', () => {
        const fullLog =
            '2022-09-16T14:13:46.927Z api:debug:event:room Subscriber hangup received from janus | publisherId 32d23050-a231-4118-b5e3-4840c9b23786.videoLow subscriberId da584607-3c79-4444-a00c-4748bb3d681c.videoLow | _room f8632f06-0f15-4901-bd90-fc7444adcd11';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'f8632f06-0f15-4901-bd90-fc7444adcd11',
            publisherId: '32d23050-a231-4118-b5e3-4840c9b23786',
            subscriberId: 'da584607-3c79-4444-a00c-4748bb3d681c',
            profile: 'videoLow',
        });
    });

    it('should handle correctly subscriber hangup event log', () => {
        const fullLog =
            '2022-09-16T14:06:11.680Z api:debug:event:room Subscriber hangup | token f02c798c-adcf-4099-950d-7d03b5d6bf6e | _room f8632f06-0f15-4901-bd90-fc7444adcd11';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'f8632f06-0f15-4901-bd90-fc7444adcd11',
            token: 'f02c798c-adcf-4099-950d-7d03b5d6bf6e'
        });
    });

    it('should handle correctly focus stacking event log', () => {
        const fullLog =
            '2022-09-16T14:32:04.507Z api:debug:event:room Client focus processing - targeted publisher not ready (stacking) | _user 42f8d68e-3f0b-4316-a7b0-e508f4a1e7db _client da584607-3c79-4444-a00c-4748bb3d681c _targetedClient f2aa512b-ac4d-4896-b6e0-eef7fe53404c | _room f8632f06-0f15-4901-bd90-fc7444adcd11';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'f8632f06-0f15-4901-bd90-fc7444adcd11',
            token: 'f02c798c-adcf-4099-950d-7d03b5d6bf6e'
        });
    });

    it('should handle correctly publisher ready event log', () => {
        const fullLog =
            '2022-09-16T14:25:34.240Z api:debug:event:room High publisher ready | token 10efb0ab-6bb8-4f87-bf93-5fc458d6d3eb subscriberClient e1ac4792-975e-43cb-b5e4-05d53c27fa80 publisherId ae1168f4-98b4-41ef-9608-e0980225de08.videoHigh | _room 337592f6-8cfd-4096-b826-98b051eea418';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'f8632f06-0f15-4901-bd90-fc7444adcd11',
            token: 'f02c798c-adcf-4099-950d-7d03b5d6bf6e'
        });
    });

    it('should handle correctly publisher ready message event log', () => {
        const fullLog =
            '2022-09-16T14:13:39.483Z api:debug:event:room Publisher ready received from janus for publisherId 32d23050-a231-4118-b5e3-4840c9b23786.videoLow | token c1f58ebf-7277-4d3d-92cd-f718cc0b2057 profile videoLow | _room f8632f06-0f15-4901-bd90-fc7444adcd11';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            _entity: 'f8632f06-0f15-4901-bd90-fc7444adcd11',
            token: 'f02c798c-adcf-4099-950d-7d03b5d6bf6e'
        });
    });
});

// other
// 2022-09-16T08:03:38.015Z api:debug:action:room Removing all pcs of the entity 26a33568-129c-4a68-9c82-0fec054b03e2 | _room 26a33568-129c-4a68-9c82-0fec054b03e2

