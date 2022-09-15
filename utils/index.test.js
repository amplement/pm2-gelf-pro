const { removeColorCharacters } = require('./index');

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
});
