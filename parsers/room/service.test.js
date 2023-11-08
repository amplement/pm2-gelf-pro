const { parser } = require('./service');
const { prepareLog } = require('../../__test__/utils');

describe('room-service', () => {
    it('should handle drop all pcs of a room action correctly', () => {
        const fullLog =
            'api:debug:service:room Removing all PCS | _entity d1859197-5e84-4861-9025-0972e25a7bcd +23m';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-service',
            _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd'
        });
    });

    it('should handle create sip PCS action correctly', () => {
        const fullLog =
            '2022-09-19T09:12:23.156Z api:debug:service:room Create sip PCS (outgoing call situation) for _user eb2ac90f-fe4b-4dad-bef6-49ce9914e180 | _entity 9038f83c-598a-4343-9f9d-84de1a0c048c';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-service',
            _entity: '9038f83c-598a-4343-9f9d-84de1a0c048c',
            initiator: {
                _user: 'eb2ac90f-fe4b-4dad-bef6-49ce9914e180'
            }
        });
    });

    it('should handle create sip PCS action correctly', () => {
        const fullLog =
            'api:debug:service:room Create sip PCS (incoming call situation) for _user janusServer | _entity d1859197-5e84-4861-9025-0972e25a7bcd';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-service',
            _entity: 'd1859197-5e84-4861-9025-0972e25a7bcd',
            initiator: {
                _user: 'janusServer'
            }
        });
    });

    it('should handle drop all pcs level of a client correctly', () => {
        const fullLog =
            'api:debug:service:room Removing PCS audio level for _client d4b527aa-4d15-4965-87ef-ad5aec064ebc | _entity - +0ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-service',
            initiator: {
                _client: 'd4b527aa-4d15-4965-87ef-ad5aec064ebc'
            }
        });
    });

    it('should handle drop all pcs of a client correctly', () => {
        const fullLog =
            'api:debug:service:room Removing all PCS for _client d4b527aa-4d15-4965-87ef-ad5aec064ebc | _entity - +20s';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-service',
            initiator: {
                _client: 'd4b527aa-4d15-4965-87ef-ad5aec064ebc'
            }
        });
    });

    it('should return empty object when log is not parseable', () => {
        const fullLog = '2022-09-19T09:12:31.215Z api:info:other coucou';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({});
    });
});
