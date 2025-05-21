const {
    removeColorCharacters,
    removeDate,
    splitMultipleLogs,
    extractContext,
    getMatchSimpleValue,
    getMatchUserValues
} = require('./index');

describe('utils', () => {
    describe('removeColorCharacters', () => {
        it('should drop colors characters', () => {
            const logLine =
                '[38;5;221;1mapi:trace:rdb [0mQuery: r.table("credentials").getAll(["root@amplement.com","ADMIN"],{index:"emailRole"}) done in 7 ms [38;5;221m+8m[0m';
            const expectedResult =
                'api:trace:rdb Query: r.table("credentials").getAll(["root@amplement.com","ADMIN"],{index:"emailRole"}) done in 7 ms +8m';
            expect(removeColorCharacters(logLine)).toBe(expectedResult);
        });
    });

    describe('removeDate', () => {
        it('should remove the date at the beginning of the log', () => {
            const log =
                '2022-09-16T08:17:57.608Z api:trace:mbc:room-sfu ⭣ roomSfu.onRegister.janus-room-proxy (subsc)';
            const expectedLog =
                'api:trace:mbc:room-sfu ⭣ roomSfu.onRegister.janus-room-proxy (subsc)';
            expect(removeDate(log)).toBe(expectedLog);
        });

        it("should do nothing if log doesn't start with a date", () => {
            const log = 'api:trace:mbc:room-sfu ⭣ roomSfu.onRegister.janus-room-proxy (subsc)';
            expect(removeDate(log)).toBe(log);
            const logIncludingDate =
                'api:trace:mbc:room-sfu ⭣ roomSfu.onRegister.janus-room-proxy (subsc) at 2022-09-16T08:17:57.608Z ';
            expect(removeDate(logIncludingDate)).toBe(logIncludingDate);
        });
    });

    describe('splitMultipleLogs', () => {
        it('should split multiple logs if needed', () => {
            const fullLog = `api:warn  Reconnecting to REDIS +0ms
                          api:error Fail during startup +0ms`;
            expect(splitMultipleLogs(fullLog)).toStrictEqual([
                'api:warn  Reconnecting to REDIS +0ms',
                'api:error Fail during startup +0ms'
            ]);
        });

        it('should do nothing if log looks good', () => {
            const fullLog = `api:warn  Reconnecting to REDIS
  api:warn interesting thing happen +0ms`;
            expect(splitMultipleLogs(fullLog)).toStrictEqual([fullLog]);
            expect(splitMultipleLogs('+1ms')).toStrictEqual(['+1ms']);
            expect(splitMultipleLogs('timer +1mss')).toStrictEqual(['timer +1mss']);
            expect(splitMultipleLogs('')).toStrictEqual(['']);
            expect(splitMultipleLogs()).toStrictEqual([]);
        });
    });

    describe('extractContext', () => {
        it('should extract context', () => {
            const log =
                'api:info  plop {"_user":"00000000-0000-0000-0000-000000000000","_client":"11111111-1111-1111-1111-111111111111","_company":"22222222-2222-2222-2222-222222222222","_spark":"33333333-3333-3333-3333-333333333333","_entity":"44444444-4444-4444-4444-444444444444","id":"55555555-5555-5555-5555-555555555555","isContext":true} +1ms';
            expect(extractContext(log)).toStrictEqual({
                _user: '00000000-0000-0000-0000-000000000000',
                _client: '11111111-1111-1111-1111-111111111111',
                _company: '22222222-2222-2222-2222-222222222222',
                _spark: '33333333-3333-3333-3333-333333333333',
                _entity: '44444444-4444-4444-4444-444444444444',
                id: '55555555-5555-5555-5555-555555555555'
            });
            expect(extractContext('something else')).toStrictEqual({});
        });
    });

    describe('getMatchSimpleValue', () => {
        it('should extract the correct value', () => {
            expect(getMatchSimpleValue('_client 12345', /_client [0-9]*/)).toBe('12345');
            expect(getMatchSimpleValue('_client:12345', /_client:[0-9]*/, ':')).toBe('12345');
        });

        it('should take the first matching value', () => {
            expect(
                getMatchSimpleValue('_client 123 _user 123 _client 456', /_client [0-9]*/g)
            ).toBe('123');
        });

        it('should return - when value does not match', () => {
            expect(getMatchSimpleValue('_client aze', /_client [0-9]+/)).toBe('-');
        });
    });

    describe('getMatchUserValues', () => {
        it('should extract the user client pair according to the main regexp', () => {
            expect(
                getMatchUserValues(
                    '_user 00000000-0000-0000-0000-000000000000 _client 11111111-1111-1111-1111-111111111111',
                    '<{user}> <{client}>'
                )
            ).toStrictEqual({
                _user: '00000000-0000-0000-0000-000000000000',
                _client: '11111111-1111-1111-1111-111111111111'
            });
            expect(
                getMatchUserValues(
                    '_user 00000000-0000-0000-0000-000000000000 _client janusServer',
                    '<{user}> <{client}>'
                )
            ).toStrictEqual({
                _user: '00000000-0000-0000-0000-000000000000',
                _client: 'janusServer'
            });
            expect(
                getMatchUserValues('_user janus _client janusServer', '<{user}> <{client}>')
            ).toStrictEqual({
                _user: 'janus',
                _client: 'janusServer'
            });
            expect(
                getMatchUserValues(
                    '_user janusServer _client 00000000000000000000000000000000',
                    '<{user}> <{client}>'
                )
            ).toStrictEqual({
                _user: 'janusServer',
                _client: '00000000000000000000000000000000'
            });
            expect(
                getMatchUserValues('_user 0000 _client 12345', '<{user}> <{client}>', {
                    userPattern: '[0]{4}',
                    clientPattern: '[0-9]+'
                })
            ).toStrictEqual({
                _user: '0000',
                _client: '12345'
            });
            expect(
                getMatchUserValues('user 0000 client 12345', '<{user}> <{client}>', {
                    userKey: 'user',
                    userPattern: '[0]{4}',
                    clientPattern: '[0-9]+',
                    clientKey: 'client'
                })
            ).toStrictEqual({
                _user: '0000',
                _client: '12345'
            });
            expect(
                getMatchUserValues('user--0000 _client--12345', '<{user}> <{client}>', {
                    userKey: 'user',
                    userPattern: '[0]{4}',
                    clientPattern: '[0-9]+',
                    splitChar: '--'
                })
            ).toStrictEqual({
                _user: '0000',
                _client: '12345'
            });
            expect(getMatchUserValues('u c', '<{user}> <{client}>')).toStrictEqual({
                _user: '-',
                _client: '-'
            });
        });

        it('should throw an error if template does not match', () => {
            expect.assertions(1);
            try {
                expect(getMatchUserValues('u 1', '<{user}>')).toStrictEqual({
                    _user: '0000',
                    _client: '12345'
                });
            } catch (e) {
                expect(e.message).toBe('Template does not contain <{_user}> and <{_client}>');
            }
        });
    });
});
