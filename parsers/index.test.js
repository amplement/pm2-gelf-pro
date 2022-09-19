const { parse } = require('./index');
describe('parsers index', () => {
    describe('parse', () => {
        it('should fail silently when logs format are unexpected', () => {
            expect(parse()).toStrictEqual({
                logLevel: 'info',
                additionalData: {
                    processingError: true,
                    errorDetails: "Cannot read properties of undefined (reading 'trim')"
                }
            });
            expect(parse(null, false)).toStrictEqual({
                logLevel: 'info',
                additionalData: {
                    processingError: true,
                    errorDetails: 'line.trim is not a function'
                }
            });
            expect(parse(1, '')).toStrictEqual({
                logLevel: 'info',
                additionalData: {
                    processingError: true,
                    errorDetails: "Cannot read properties of undefined (reading 'name')"
                }
            });
        });
    });
});
