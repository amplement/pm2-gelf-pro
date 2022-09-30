const { prepareLog } = require('../../__test__/utils');
const { parser } = require('./http');
describe('room-http', () => {
    it('should handle join request event', () => {
        const fullLog =
            '2022-09-30T07:39:00.759Z api:debug:http:room Join request for _user 04271c85-7963-4b7f-aded-35ceb8b2ce3a _client f2275181-9b6a-4a9d-bdca-96d432aebe6b | _entity d4994ffa-e2d6-4fd3-b747-30abad7e399b';
        const { head, body: log } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-http',
            _user: '04271c85-7963-4b7f-aded-35ceb8b2ce3a',
            _entity: 'd4994ffa-e2d6-4fd3-b747-30abad7e399b',
            _client: 'f2275181-9b6a-4a9d-bdca-96d432aebe6b'
        });
    });

    it('should handle leave request event', () => {
        const fullLog =
            '2022-09-30T07:37:24.424Z api:debug:http:room Leave requested by _user e92b9353-0937-4668-bf8d-a3f44d1b3c1b _client 94f2d804-ed9c-40a1-8a85-4caa1fd29998 | _entity 3cd1e898-153c-4950-91c9-c7722c0d7234';
        const { head, body: log } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-http',
            _user: 'e92b9353-0937-4668-bf8d-a3f44d1b3c1b',
            _entity: '3cd1e898-153c-4950-91c9-c7722c0d7234',
            _client: '94f2d804-ed9c-40a1-8a85-4caa1fd29998'
        });
    });

    it('should handle refused request event', () => {
        const fullLog =
            '2022-09-30T07:33:32.137Z api:debug:http:room Room refused by _user 9f070288-2a4b-4e95-81d4-740ad41ac060 _client 3f8b7d4d-a3d6-4a78-9f8c-0b7ccaa722ea | _entity be121e6d-42ff-4e21-b9e8-de87e0fdfe8e';
        const { head, body: log } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-http',
            _user: '9f070288-2a4b-4e95-81d4-740ad41ac060',
            _entity: 'be121e6d-42ff-4e21-b9e8-de87e0fdfe8e',
            _client: '3f8b7d4d-a3d6-4a78-9f8c-0b7ccaa722ea'
        });
    });

    it('should handle change media request event', () => {
        const fullLog =
            '2022-09-30T07:33:12.598Z api:debug:http:room Change media requested by _user b0a71dc3-06b6-4791-a181-05cd76b45d27 _client cf21e39d-6066-43ee-a818-ef37447cfa12 | _entity be121e6d-42ff-4e21-b9e8-de87e0fdfe8e';
        const { head, body: log } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-http',
            _user: 'b0a71dc3-06b6-4791-a181-05cd76b45d27',
            _entity: 'be121e6d-42ff-4e21-b9e8-de87e0fdfe8e',
            _client: 'cf21e39d-6066-43ee-a818-ef37447cfa12'
        });
    });

    it('should handle transfer request event', () => {
        const fullLog =
            '2022-09-29T18:57:50.310Z api:debug:http:room Transfer required by _user bed6a8bd-15a4-4849-b731-046da3fe7b36 | _entity 7d4c3a60-2485-40d2-8540-b8cbdccd3b56';
        const { head, body: log } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-http',
            _user: 'bed6a8bd-15a4-4849-b731-046da3fe7b36',
            _entity: '7d4c3a60-2485-40d2-8540-b8cbdccd3b56'
        });
    });

    it('should handle room patch request event', () => {
        const fullLog =
            '2022-09-29T16:51:06.032Z api:debug:http:room Room patch requested by _user 0f8e72ff-d22a-4768-99b8-56592dda89b7 | _entity 817f5f3f-8eaa-4ee0-8fe7-891e5adf0a6e';
        const { head, body: log } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-http',
            _user: '0f8e72ff-d22a-4768-99b8-56592dda89b7',
            _entity: '817f5f3f-8eaa-4ee0-8fe7-891e5adf0a6e'
        });
    });

    it('should return empty object when log is not parseable', () => {
        const fullLog = '2022-09-19T09:12:31.215Z api:info:other coucou';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({});
    });
});
