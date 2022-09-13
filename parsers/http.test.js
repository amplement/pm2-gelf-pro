const {
    getVersion,
    isUuid,
    extractQueryParams,
    extractRequestGroup,
    parser,
    extractAndProcessContext,
    parseLogQueue
} = require('./http');

describe('http log parser', () => {
    describe('getVersion', () => {
        it('should extract correctly version', () => {
            expect(getVersion('v1')).toBe(1);
            expect(getVersion('v5')).toBe(5);
            expect(getVersion('v10')).toBe(10);
            expect(getVersion('v200')).toBe(200);
        });
        it('should return 1 if version cannot be extracted', () => {
            expect(getVersion(undefined)).toBe(1);
            expect(getVersion(null)).toBe(1);
            expect(getVersion(1)).toBe(1);
            expect(getVersion('1')).toBe(1);
            expect(getVersion('v-1')).toBe(1);
            expect(getVersion('version')).toBe(1);
            expect(getVersion([])).toBe(1);
        });
    });
    describe('isUuid', () => {
        it('should recognize uuid', () => {
            expect(isUuid('00000000-0000-0000-0000-000000000000')).toBe(true);
            expect(isUuid('00000000-0000-0000-0000-00000000000g')).toBe(false);
            expect(isUuid('00000000-0000-0000-0000-00000000000')).toBe(false);
            expect(isUuid('00000000-0000-0000-0g00-000000000000')).toBe(false);
            expect(isUuid(undefined)).toBe(false);
            expect(isUuid([])).toBe(false);
            expect(isUuid(null)).toBe(false);
            expect(isUuid('')).toBe(false);
        });
    });
    describe('extractQueryParams', () => {
        it('should extract query params', () => {
            expect(extractQueryParams('http://ok.com?foo=bar&baz=gro')).toStrictEqual({
                baseUrl: 'http://ok.com',
                queryParams: 'foo=bar&baz=gro'
            });
            expect(extractQueryParams('http://ok.com&foo=bar&baz=gro')).toStrictEqual({
                baseUrl: 'http://ok.com&foo=bar&baz=gro'
            });
            expect(extractQueryParams('a?b')).toStrictEqual({ baseUrl: 'a', queryParams: 'b' });
        });
    });
    describe('extractRequestGroup', () => {
        it('should split url into searchable entities', () => {
            expect(extractRequestGroup('/users/me')).toStrictEqual({
                version: 1,
                admin: false,
                type: 'users',
                rest: 'me'
            });
            expect(
                extractRequestGroup(
                    '/admin/monitor/sockets/sparks/00000000-0000-0000-0000-000000000000'
                )
            ).toStrictEqual({
                version: 1,
                admin: true,
                type: 'monitor',
                rest: 'sockets/sparks/00000000-0000-0000-0000-000000000000'
            });
            expect(
                extractRequestGroup(
                    '/admin/users/00000000-0000-0000-0000-000000000000/push-notification/ping'
                )
            ).toStrictEqual({
                version: 1,
                admin: true,
                type: 'users',
                _entity: '00000000-0000-0000-0000-000000000000',
                subType: 'push-notification',
                rest: 'ping'
            });
            expect(
                extractRequestGroup('/users/00000000-0000-0000-0000-000000000000')
            ).toStrictEqual({
                version: 1,
                admin: false,
                type: 'users',
                _entity: '00000000-0000-0000-0000-000000000000'
            });
            expect(
                extractRequestGroup(
                    '/v5/feeds/00000000-0000-0000-0000-000000000000/members/11111111-1111-1111-1111-111111111111'
                )
            ).toStrictEqual({
                version: 5,
                admin: false,
                type: 'feeds',
                _entity: '00000000-0000-0000-0000-000000000000',
                subType: 'members',
                _subEntity: '11111111-1111-1111-1111-111111111111'
            });
            expect(
                extractRequestGroup(
                    '/v5/users/00000000-0000-0000-0000-000000000000/acknowledgements'
                )
            ).toStrictEqual({
                version: 5,
                admin: false,
                type: 'users',
                _entity: '00000000-0000-0000-0000-000000000000',
                subType: 'acknowledgements'
            });
        });
    });
    describe('extractAndProcessContext', () => {
        it('should extract the context of an http request', () => {
            expect(extractAndProcessContext('a b c {d e f}')).toStrictEqual({
                context: '{d e f}',
                log: 'a b c'
            });
            expect(extractAndProcessContext('a b c {d e f} g')).toStrictEqual({
                log: 'a b c {d e f} g'
            });
            expect(extractAndProcessContext('a b c')).toStrictEqual({ log: 'a b c' });
        });
    });

    describe('parseLogQueue', () => {
        it('should extract userAgent and _client', () => {
            expect(parseLogQueue('bla bla bal 00000000-0000-0000-0000-000000000000')).toStrictEqual(
                { userAgent: 'bla bla bal', _client: '00000000-0000-0000-0000-000000000000' }
            );
            expect(
                parseLogQueue('bla bla bal 00000000-0000-0000-0000-000000000000 blop')
            ).toStrictEqual({ userAgent: 'bla bla bal 00000000-0000-0000-0000-000000000000 blop' });
        });
    });
    describe('parser', () => {
        it('should read and format an http log', () => {
            const log =
                "89.101.10.145 [2022-09-12T14:37:31.994Z] - ⭣ POST: /feed/0b02c35a-69ed-4019-94c0-43e556a64bc0/acknowledgements 201 rt=0.035 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33 e0aa11f3-bc60-4363-a15c-bf185435e2e9 { _user: '2410a410-6ae7-4da5-b70e-08f951d268d9', _client: undefined, _company: '732cdb1a-23a1-4829-824f-02289cecdefd', _spark: undefined, _entity: undefined, id: '2410a410-6ae7-4da5-b70e-08f951d268d9', isContext: true }";
            expect(parser(log)).toStrictEqual({
                ip: '89.101.10.145',
                country: '-',
                httpVerb: 'POST',
                url: '/feed/0b02c35a-69ed-4019-94c0-43e556a64bc0/acknowledgements',
                responseCode: '201',
                executionTime: 0.035,
                userAgent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33',
                _client: 'e0aa11f3-bc60-4363-a15c-bf185435e2e9',
                admin: false,
                version: 1,
                type: 'feed',
                _entity: '0b02c35a-69ed-4019-94c0-43e556a64bc0',
                subType: 'acknowledgements',
                context:
                    "{ _user: '2410a410-6ae7-4da5-b70e-08f951d268d9', _client: undefined, _company: '732cdb1a-23a1-4829-824f-02289cecdefd', _spark: undefined, _entity: undefined, id: '2410a410-6ae7-4da5-b70e-08f951d268d9', isContext: true }"
            });
        });
    });
});