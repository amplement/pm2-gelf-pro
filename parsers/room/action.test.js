const { parser } = require('./action');
const { parseHead } = require('../index');
const { removeColorCharacters, removeDate } = require('../../utils');

function prepareLog(log) {
    return parseHead(removeColorCharacters(removeDate(log)));
}

describe('action', () => {
    it('should handle create sip PCS action correctly', () => {
        const fullLog =
            '2022-09-16T08:03:38.015Z api:debug:action:room Removing all pcs of the entity 26a33568-129c-4a68-9c82-0fec054b03e2 | _room 26a33568-129c-4a68-9c82-0fec054b03e2';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-action',
            _entity: '26a33568-129c-4a68-9c82-0fec054b03e2'
        });
    });

    it('should handle drop all pcs action correctly', () => {
        const fullLog =
            '2022-09-19T09:12:23.156Z api:debug:action:room Create sip PCS (outgoing call situation) for _user eb2ac90f-fe4b-4dad-bef6-49ce9914e180 | _room 9038f83c-598a-4343-9f9d-84de1a0c048c';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-action',
            _entity: '9038f83c-598a-4343-9f9d-84de1a0c048c',
            initiator: {
                _user: 'eb2ac90f-fe4b-4dad-bef6-49ce9914e180'
            }
        });
    });
});
