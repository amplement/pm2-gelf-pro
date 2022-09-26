const { removeColorCharacters, removeDate, splitMultipleLogs } = require('./index');

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
});
