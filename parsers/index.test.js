const parser = require('./index');
// import * as parser from './index';

const logs = [
    [
        'api',
        'debug',
        'pcs-stats',
        'room',
        'api:debug:pcs-stats:room PC connection state change to "connected" | profileKey audioLow token 066b2572-150f-4613-b385-15c325aca163 _entity 0ad15985-2ba4-4abe-81d9-5fc30f2fb4f4'
    ],
    [
        'api',
        'info',
        'pcs',
        'room',
        'api:info:pcs:room Create | status waiting token 16428175-272c-4d7b-b6b4-88bac21d273c instanceId 1 serverType - profileKey audioLow type peer in _entity 0ad15985-2ba4-4abe-81d9-5fc30f2fb4f4 between _user 8ae0db27-d08e-4eac-b6ec-a32f9378f4e1 _client 834a089b-e911-4820-b1a9-9ac0838f6e2a and _user 279ef0f0-45da-45cc-a100-84288c124f98 _client 528b50d0-3518-408a-8afd-9a405995cd49'
    ],
    [
        'api',
        'info',
        'http',
        'room',
        'api:info:http:room 176.169.17.26 [2023-11-03T12:07:47.385Z] cfRay=82047fb90cea99ba-CDG FR ⭣ POST: /rooms/0ad15985-2ba4-4abe-81d9-5fc30f2fb4f4/leave/8ae0db27-d08e-4eac-b6ec-a32f9378f4e1 201 rt=0.027 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
    ],
    [
        'pns',
        'info',
        'notification',
        'onesignal',
        'pns:info:notification:onesignal https://dashboard.onesignal.com/apps/588c57aa-c126-4a02-9cc0-f323400512e9/notifications/ded26018-8829-4e8e-8184-8df6c8ce2545 | code ROOM_MISSED _entity 5aa31b44-92f1-4cb5-8c73-916bdb7f3a24 _user 88453bc0-c81c-4e8f-b231-658414be00c8 internalId 657b52a0-938f-459f-bf07-5672a2805861 appName mycollaborate:default:global providerNotificationId ded26018-8829-4e8e-8184-8df6c8ce2545'
    ]
];
const base = {
    process: {
        name: null
    }
};
describe('parsers index', () => {
    describe('retrieveOriginDate', () => {
        it('should extract the date at the beginning of the log', () => {
            const log =
                '2022-09-16T08:17:57.608Z api:trace:mbc:room-sfu ⭣ roomSfu.onRegister.janus-room-proxy (subsc)';
            expect(parser.retrieveOriginDate(log)).toBe(1663316277.608);
        });
        it('should return undefined if nothing found', () => {
            const log = 'api:trace:mbc:room-sfu ⭣ roomSfu.onRegister.janus-room-proxy (subsc)';
            expect(parser.retrieveOriginDate(log)).toBeUndefined();
        });
        test.each([[null], [''], [{}]])(
            'should return undefined if value %i is provided',
            (value) => {
                expect(parser.retrieveOriginDate(value)).toBeUndefined();
            }
        );
    });
    describe('parse', () => {
        it.each(logs)(
            'should retrieve general properties for all kind of logs',
            (origin, level, type, entity, line) => {
                expect(parser.parse(base, line)).toHaveProperty('logLevel', level);
                expect(parser.parse(base, line)).toHaveProperty('additionalData.origin', origin);
                expect(parser.parse(base, line)).toHaveProperty('additionalData.type', type);
                expect(parser.parse(base, line)).toHaveProperty('additionalData.entity', entity);
            }
        );
        it('should fail silently when logs format are unexpected', () => {
            expect(parser.parse()).toStrictEqual({
                logLevel: 'info',
                additionalData: {
                    processingError: true,
                    errorDetails: "Cannot read properties of undefined (reading 'toString')"
                }
            });
            expect(parser.parse(null, false)).toStrictEqual({
                logLevel: 'info',
                additionalData: {
                    processingError: true,
                    errorDetails: "Cannot read properties of null (reading 'process')"
                }
            });
            expect(parser.parse(1, '')).toStrictEqual({
                logLevel: 'info',
                additionalData: {
                    processingError: true,
                    errorDetails: "Cannot read properties of undefined (reading 'name')"
                }
            });
        });
    });
});
