const {
    getVersion,
    isUuid,
    extractQueryParams,
    extractRequestGroup,
    parser,
    extractAndProcessContext,
    parseLogQueue
} = require('./http');
const { prepareLog } = require('../__test__/utils');

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
            expect(extractQueryParams('a?b')).toStrictEqual({
                baseUrl: 'a',
                queryParams: 'b'
            });
            expect(extractQueryParams('/a?b')).toStrictEqual({
                baseUrl: 'a',
                queryParams: 'b'
            });
        });
    });

    describe('extractRequestGroup', () => {
        it('should split url into searchable entities', () => {
            expect(extractRequestGroup('/users/me')).toStrictEqual({
                version: 1,
                admin: false,
                entityType: 'users',
                rest: 'me',
                basePath: 'users/me'
            });
            expect(
                extractRequestGroup(
                    '/admin/monitor/sockets/sparks/00000000-0000-0000-0000-000000000000'
                )
            ).toStrictEqual({
                version: 1,
                admin: true,
                entityType: 'monitor',
                rest: 'sockets/sparks/00000000-0000-0000-0000-000000000000',
                basePath: 'admin/monitor/sockets/sparks/:_id'
            });
            expect(
                extractRequestGroup(
                    '/admin/users/00000000-0000-0000-0000-000000000000/push-notification/ping'
                )
            ).toStrictEqual({
                version: 1,
                admin: true,
                entityType: 'users',
                _entity: '00000000-0000-0000-0000-000000000000',
                subEntityType: 'push-notification',
                rest: 'ping',
                basePath: 'admin/users/:_id/push-notification/ping'
            });
            expect(
                extractRequestGroup('/users/00000000-0000-0000-0000-000000000000')
            ).toStrictEqual({
                version: 1,
                admin: false,
                entityType: 'users',
                _entity: '00000000-0000-0000-0000-000000000000',
                basePath: 'users/:_id'
            });
            expect(
                extractRequestGroup(
                    '/v5/feeds/00000000-0000-0000-0000-000000000000/members/11111111-1111-1111-1111-111111111111'
                )
            ).toStrictEqual({
                version: 5,
                admin: false,
                entityType: 'feeds',
                _entity: '00000000-0000-0000-0000-000000000000',
                subEntityType: 'members',
                _subEntity: '11111111-1111-1111-1111-111111111111',
                basePath: 'v5/feeds/:_id/members/:_subId'
            });
            expect(
                extractRequestGroup(
                    '/v5/users/00000000-0000-0000-0000-000000000000/acknowledgements'
                )
            ).toStrictEqual({
                version: 5,
                admin: false,
                entityType: 'users',
                _entity: '00000000-0000-0000-0000-000000000000',
                subEntityType: 'acknowledgements',
                basePath: 'v5/users/:_id/acknowledgements'
            });
        });
    });

    describe('extractAndProcessContext', () => {
        it('should extract the context of an http request', () => {
            expect(
                extractAndProcessContext(
                    'a b c {"_user":"00000000-0000-0000-0000-000000000000","isContext":true}'
                )
            ).toStrictEqual({
                context: { _user: '00000000-0000-0000-0000-000000000000' },
                log: 'a b c'
            });
            expect(extractAndProcessContext('a b c {"stuff":true} g')).toStrictEqual({
                log: 'a b c {"stuff":true} g'
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
            const fullLog = `api:info:http 89.101.10.145 [2022-09-12T14:37:31.994Z] cfRay=75c029d39e85d357-CDG - ⭣ POST: /feed/0b02c35a-69ed-4019-94c0-43e556a64bc0/acknowledgements 201 rt=0.035 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33 e0aa11f3-bc60-4363-a15c-bf185435e2e9 {"_user":"2410a410-6ae7-4da5-b70e-08f951d268d9","_client":undefined,"_company":"732cdb1a-23a1-4829-824f-02289cecdefd","_spark":undefined,"_entity":undefined,"id":"2410a410-6ae7-4da5-b70e-08f951d268d9","isContext":true}`;
            const { head, body: log } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'http',
                ip: '89.101.10.145',
                country: '-',
                httpMethod: 'POST',
                path: '/feed/0b02c35a-69ed-4019-94c0-43e556a64bc0/acknowledgements',
                responseCode: '201',
                executionTime: 0.035,
                userAgent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33',
                _client: 'e0aa11f3-bc60-4363-a15c-bf185435e2e9',
                admin: false,
                cfRay: '75c029d39e85d357-CDG',
                version: 1,
                entityType: 'feed',
                _entity: '0b02c35a-69ed-4019-94c0-43e556a64bc0',
                subEntityType: 'acknowledgements',
                basePath: 'feed/:_id/acknowledgements',
                context: {
                    _user: '2410a410-6ae7-4da5-b70e-08f951d268d9',
                    _company: '732cdb1a-23a1-4829-824f-02289cecdefd',
                    id: '2410a410-6ae7-4da5-b70e-08f951d268d9'
                }
            });
        });

        it('should read and format an http log without context', () => {
            const fullLog = `api:info:http 89.101.10.145 [2022-09-12T14:37:31.994Z] cfRay=75c029d39e85d357-CDG - ⭣ POST: /feed/0b02c35a-69ed-4019-94c0-43e556a64bc0/acknowledgements 201 rt=0.035 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33 e0aa11f3-bc60-4363-a15c-bf185435e2e9`;
            const { head, body: log } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'http',
                ip: '89.101.10.145',
                country: '-',
                httpMethod: 'POST',
                path: '/feed/0b02c35a-69ed-4019-94c0-43e556a64bc0/acknowledgements',
                responseCode: '201',
                executionTime: 0.035,
                userAgent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33',
                _client: 'e0aa11f3-bc60-4363-a15c-bf185435e2e9',
                admin: false,
                cfRay: '75c029d39e85d357-CDG',
                version: 1,
                entityType: 'feed',
                _entity: '0b02c35a-69ed-4019-94c0-43e556a64bc0',
                subEntityType: 'acknowledgements',
                basePath: 'feed/:_id/acknowledgements'
            });
        });

        it('should parse room http log as regular http log', () => {
            const fullLog = `2022-10-09T22:03:47.280Z api:info:http:room 185.234.70.46 [2022-10-09T22:03:47.273Z] - FR ⭣ GET: /rooms 200 rt=0.007 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.34 3d728d32-83ed-4d4d-b309-77dae75d8779 { _user: '3ff83a44-e696-4706-bc85-e05ec9722912', _client: undefined, _company: 'd84c80c6-e63e-4cb7-9ca9-445628e9e845', _spark: undefined, _entity: undefined, id: '3ff83a44-e696-4706-bc85-e05ec9722912', isContext: true }`;
            const { head, body: log } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'http',
                ip: '185.234.70.46',
                country: 'FR',
                httpMethod: 'GET',
                path: '/rooms',
                responseCode: '200',
                executionTime: 0.007,
                userAgent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.34',
                _client: '3d728d32-83ed-4d4d-b309-77dae75d8779',
                admin: false,
                cfRay: '-',
                version: 1,
                entityType: 'rooms',
                basePath: 'rooms',
                context: {}
            });
        });

        it('should parse http log including space into IP addresses', () => {
            const fullLog = `2022-12-07T09:39:00.077Z api:info:http 10.59.198.68, 192.54.145.139,245.233.239.9 [2022-12-07T09:39:00.069Z] cfRay=775c4aa54a1dd3af-CDG FR ⭣ HEAD: /companies?_parent=639dd801-92b5-4e68-9915-f75000d293cc&subdomain=xdxd 404 rt=0.007 Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0 - { _user: undefined, _client: undefined, _company: undefined, _spark: undefined, _entity: undefined, id: undefined, isContext: true }`;
            const { head, body: log } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({
                parser: 'http',
                ip: '10.59.198.68,192.54.145.139,245.233.239.9',
                country: 'FR',
                httpMethod: 'HEAD',
                path: '/companies?_parent=639dd801-92b5-4e68-9915-f75000d293cc&subdomain=xdxd',
                responseCode: '404',
                executionTime: 0.007,
                userAgent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0',
                _client: '-',
                admin: false,
                queryParams: '_parent=639dd801-92b5-4e68-9915-f75000d293cc&subdomain=xdxd',
                cfRay: '775c4aa54a1dd3af-CDG',
                version: 1,
                entityType: 'companies',
                basePath: 'companies',
                context: {}
            });
        });

        it('should return empty object when log is not parseable', () => {
            const fullLog = '2022-09-19T09:12:31.215Z api:info:other coucou';
            const { body: log, head } = prepareLog(fullLog);
            expect(parser(log, head)).toStrictEqual({});
        });
    });
});
