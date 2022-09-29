const { prepareLog } = require('../../__test__/utils');
const { parser } = require('./pcs-stats');
describe('pcs-stats', () => {
    it('should parse pcs stats create event correctly', () => {
        const fullLog =
            'api:debug:pcs:stats created | token 578ae9c5-9875-471e-96f3-5f06c3e5534a _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 sinceCreation 0ms sincePrevious -ms +1ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '578ae9c5-9875-471e-96f3-5f06c3e5534a',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9'
        });
    });

    it('should parse pcs stats ice connection stats change event correctly', () => {
        const fullLog =
            'api:debug:pcs:stats ICE connection state change to "new" | token 7cc7f2d8-7a38-42a7-bac5-98433134b2ad _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 sinceCreation 541ms sincePrevious 541ms +541ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '7cc7f2d8-7a38-42a7-bac5-98433134b2ad',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9'
        });
    });

    it('should parse pcs stats PC connection stats change event correctly', () => {
        const fullLog =
            'api:debug:pcs:stats PC connection state change to "connecting" | token ee65e403-0e76-41d7-8b4a-affd9ed9360b _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 sinceCreation 732ms sincePrevious 1ms +1ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: 'ee65e403-0e76-41d7-8b4a-affd9ed9360b',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9'
        });
    });

    it('should parse pcs stats ICE candidate received event correctly', () => {
        const fullLog =
            'api:debug:pcs:stats ICE candidate n°1 received "candidate:0 1 UDP 2122252543 192.168.68.108 59772 typ host" | token 7cc7f2d8-7a38-42a7-bac5-98433134b2ad _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 sinceCreation 1028ms sincePrevious 130ms +127ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '7cc7f2d8-7a38-42a7-bac5-98433134b2ad',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9'
        });
    });

    it('should parse pcs stats ICE candidate emitted event correctly', () => {
        const fullLog =
            'api:debug:pcs:stats ICE candidate n°3 received "candidate:0 1 UDP 2122252543 192.168.68.108 52159 typ host" | token f3d0a037-f053-4c1c-8c58-7aa06d599b4e _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 sinceCreation 2156ms sincePrevious 2156ms +12ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: 'f3d0a037-f053-4c1c-8c58-7aa06d599b4e',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9'
        });
    });

    it('should parse pcs stats ready event correctly', () => {
        const fullLog =
            'api:debug:pcs:stats ready | token 7cc7f2d8-7a38-42a7-bac5-98433134b2ad _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 sinceCreation 1112ms sincePrevious 84ms +82ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '7cc7f2d8-7a38-42a7-bac5-98433134b2ad',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9'
        });
    });

    it('should parse pcs stats SDP offer event correctly', () => {
        const fullLog = `api:debug:pcs:stats SDP Offer send | v=0
            api:debug:pcs:stats o=- 1663934839290637 1 IN IP4 51.38.47.162
            api:debug:pcs:stats s=VideoRoom 1253660312843368
            api:debug:pcs:stats t=0 0
            api:debug:pcs:stats a=group:BUNDLE video
            api:debug:pcs:stats a=extmap-allow-mixed
            api:debug:pcs:stats a=msid-semantic: WMS 1664cf97ed8494d950e4e34ccba93d1d
            api:debug:pcs:stats m=video 9 UDP/TLS/RTP/SAVPF 96 97
            api:debug:pcs:stats c=IN IP4 51.38.47.162
            api:debug:pcs:stats a=sendonly
            api:debug:pcs:stats a=mid:video
            api:debug:pcs:stats a=rtcp-mux
            api:debug:pcs:stats a=ice-ufrag:V+Gz
            api:debug:pcs:stats a=ice-pwd:lpGY+3Wl2TlLG79Se0SRnN
            api:debug:pcs:stats a=ice-options:trickle
            api:debug:pcs:stats a=fingerprint:sha-256 67:0C:77:E2:5D:21:45:88:AF:51:44:ED:07:A7:5B:31:FF:67:13:1B:E9:61:B2:24:28:59:BF:1C:F9:B8:09:01
            api:debug:pcs:stats a=setup:actpass
            api:debug:pcs:stats a=rtpmap:96 VP8/90000
            api:debug:pcs:stats a=rtcp-fb:96 ccm fir
            api:debug:pcs:stats a=rtcp-fb:96 nack
            api:debug:pcs:stats a=rtcp-fb:96 nack pli
            api:debug:pcs:stats a=rtcp-fb:96 goog-remb
            api:debug:pcs:stats a=rtcp-fb:96 transport-cc
            api:debug:pcs:stats a=extmap:1 urn:ietf:params:rtp-hdrext:sdes:mid
            api:debug:pcs:stats a=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
            api:debug:pcs:stats a=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
            api:debug:pcs:stats a=fmtp:96 max-fs=12288;max-fr=60
            api:debug:pcs:stats a=rtpmap:97 rtx/90000
            api:debug:pcs:stats a=fmtp:97 apt=96
            api:debug:pcs:stats a=ssrc-group:FID 552804238 245066806
            api:debug:pcs:stats a=msid:1664cf97ed8494d950e4e34ccba93d1d janusv0
            api:debug:pcs:stats a=ssrc:552804238 cname:janus
            api:debug:pcs:stats a=ssrc:552804238 msid:1664cf97ed8494d950e4e34ccba93d1d janusv0
            api:debug:pcs:stats a=ssrc:552804238 mslabel:1664cf97ed8494d950e4e34ccba93d1d
            api:debug:pcs:stats a=ssrc:552804238 label:janusv0
            api:debug:pcs:stats a=ssrc:245066806 cname:janus
            api:debug:pcs:stats a=ssrc:245066806 msid:1664cf97ed8494d950e4e34ccba93d1d janusv0
            api:debug:pcs:stats a=ssrc:245066806 mslabel:1664cf97ed8494d950e4e34ccba93d1d
            api:debug:pcs:stats a=ssrc:245066806 label:janusv0
            api:debug:pcs:stats a=candidate:1 1 udp 2015363327 51.38.47.162 24086 typ host
            api:debug:pcs:stats a=end-of-candidates
            api:debug:pcs:stats  | token 3237bbcc-0d7f-446e-bb9b-5e090b479604 _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 sinceCreation 50ms sincePrevious 50ms +50ms`;
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '3237bbcc-0d7f-446e-bb9b-5e090b479604',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9'
        });
    });

    it('should parse pcs stats SDP answer event correctly', () => {
        const fullLog = `api:debug:pcs:stats SDP Answer send | v=0
            api:debug:pcs:stats o=mozilla...THIS_IS_SDPARTA-99.0 1663934878926785 1 IN IP4 54.38.43.211
            api:debug:pcs:stats s=VideoRoom 4386705299911934
            api:debug:pcs:stats t=0 0
            api:debug:pcs:stats a=group:BUNDLE 0
            api:debug:pcs:stats a=extmap-allow-mixed
            api:debug:pcs:stats a=msid-semantic: WMS janus
            api:debug:pcs:stats m=video 9 UDP/TLS/RTP/SAVPF 120 124
            api:debug:pcs:stats c=IN IP4 54.38.43.211
            api:debug:pcs:stats a=recvonly
            api:debug:pcs:stats a=mid:0
            api:debug:pcs:stats a=rtcp-mux
            api:debug:pcs:stats a=ice-ufrag:wPqw
            api:debug:pcs:stats a=ice-pwd:i0OqOMwDd7Vr8XSod27r4s
            api:debug:pcs:stats a=ice-options:trickle
            api:debug:pcs:stats a=fingerprint:sha-256 67:0C:77:E2:5D:21:45:88:AF:51:44:ED:07:A7:5B:31:FF:67:13:1B:E9:61:B2:24:28:59:BF:1C:F9:B8:09:01
            api:debug:pcs:stats a=setup:active
            api:debug:pcs:stats a=rtpmap:120 VP8/90000
            api:debug:pcs:stats a=rtcp-fb:120 ccm fir
            api:debug:pcs:stats a=rtcp-fb:120 nack
            api:debug:pcs:stats a=rtcp-fb:120 nack pli
            api:debug:pcs:stats a=rtcp-fb:120 goog-remb
            api:debug:pcs:stats a=rtcp-fb:120 transport-cc
            api:debug:pcs:stats a=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid
            api:debug:pcs:stats a=extmap:6/sendonly http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
            api:debug:pcs:stats a=extmap:7 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
            api:debug:pcs:stats a=fmtp:120 max-fs=12288;max-fr=60
            api:debug:pcs:stats a=rtpmap:124 rtx/90000
            api:debug:pcs:stats a=fmtp:124 apt=120
            api:debug:pcs:stats a=msid:janus janusv0
            api:debug:pcs:stats a=ssrc:3138246228 cname:janus
            api:debug:pcs:stats a=ssrc:3138246228 msid:janus janusv0
            api:debug:pcs:stats a=ssrc:3138246228 mslabel:janus
            api:debug:pcs:stats a=ssrc:3138246228 label:janusv0
            api:debug:pcs:stats a=candidate:1 1 udp 2015363327 54.38.43.211 22914 typ host
            api:debug:pcs:stats a=end-of-candidates
            api:debug:pcs:stats  | token 80fd7eb2-0103-4ede-a7c8-fc209ba0d001 _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 sinceCreation 548ms sincePrevious 548ms +491ms`;
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '80fd7eb2-0103-4ede-a7c8-fc209ba0d001',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9'
        });
    });

    it('should parse pcs stats deleted event correctly', () => {
        const fullLog =
            'api:debug:pcs:stats deleted | token 833b09c3-1c27-4046-ac14-1f178ff6c9e7 _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 sinceCreation 28020ms sincePrevious 28020ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '833b09c3-1c27-4046-ac14-1f178ff6c9e7',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9'
        });
    });

    it('should parse pcs stats created event correctly', () => {
        const fullLog =
            'api:debug:pcs:stats Created | token 02010338-170f-40ee-814d-fdc41db86d53 _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '02010338-170f-40ee-814d-fdc41db86d53',
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5'
        });
    });

    it('should return empty object when log is not parseable', () => {
        const fullLog = '2022-09-19T09:12:31.215Z api:info:other coucou';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({});
    });
});
