const { prepareLog } = require('../../__test__/utils');
const { parser } = require('./pcs-stats');
describe('pcs-stats', () => {
    it('should parse pcs stats create event correctly', () => {
        const fullLog =
            'api:debug:pcs-stats:room created retriedTimes - country FR pcType publisher initialToken 578ae9c5-9875-471e-96f3-5f06c3e5534a token 578ae9c5-9875-471e-96f3-5f06c3e5534a _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 _user d6e25ce8-bbe3-4494-8e9d-711cf1ad819e _client 2a729f00-8185-4832-87e6-ddfe4449ee84 sinceCreation 0ms sincePrevious -ms +1ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '578ae9c5-9875-471e-96f3-5f06c3e5534a',
            initialToken: '578ae9c5-9875-471e-96f3-5f06c3e5534a',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9',
            _user: 'd6e25ce8-bbe3-4494-8e9d-711cf1ad819e',
            _client: '2a729f00-8185-4832-87e6-ddfe4449ee84',
            retriedTimes_int: '-',
            country: 'FR',
            pcType: 'publisher',
            iceState: '-',
            iceCandTyp: '-',
            pcState: '-',
            profileKey: '-'
        });
    });

    it('should parse pcs stats ice connection stats change event correctly', () => {
        const fullLog =
            'api:debug:pcs-stats:room ICE connection state change to "new" retriedTimes - country FR iceState new pcType pstn-publisher profileKey audio token 7cc7f2d8-7a38-42a7-bac5-98433134b2ad _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 _user d6e25ce8-bbe3-4494-8e9d-711cf1ad819e _client 2a729f00-8185-4832-87e6-ddfe4449ee84 sinceCreation 541ms sincePrevious 541ms +541ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '7cc7f2d8-7a38-42a7-bac5-98433134b2ad',
            initialToken: '-',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9',
            _user: 'd6e25ce8-bbe3-4494-8e9d-711cf1ad819e',
            _client: '2a729f00-8185-4832-87e6-ddfe4449ee84',
            retriedTimes_int: '-',
            country: 'FR',
            profileKey: 'audio',
            pcType: 'pstn-publisher',
            pcState: '-',
            iceState: 'new',
            iceCandTyp: '-'
        });
    });

    it('should parse pcs stats PC connection stats change event correctly', () => {
        const fullLog =
            'api:debug:pcs-stats:room PC connection state change to "connecting" retriedTimes - country FR pcState connecting pcType publisher token ee65e403-0e76-41d7-8b4a-affd9ed9360b _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 _user d6e25ce8-bbe3-4494-8e9d-711cf1ad819e _client 2a729f00-8185-4832-87e6-ddfe4449ee84 sinceCreation 732ms sincePrevious 1ms +1ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: 'ee65e403-0e76-41d7-8b4a-affd9ed9360b',
            initialToken: '-',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9',
            _user: 'd6e25ce8-bbe3-4494-8e9d-711cf1ad819e',
            _client: '2a729f00-8185-4832-87e6-ddfe4449ee84',
            retriedTimes_int: '-',
            country: 'FR',
            profileKey: '-',
            pcType: 'publisher',
            iceState: '-',
            iceCandTyp: '-',
            pcState: 'connecting'
        });
    });

    it('should parse pcs stats ICE candidate received event correctly', () => {
        const fullLog =
            'api:debug:pcs-stats:room ICE candidate n°1 received "candidate:0 1 UDP 2122252543 192.168.68.108 59772 typ host " retriedTimes - country FR pcType peer token 7cc7f2d8-7a38-42a7-bac5-98433134b2ad _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 _user d6e25ce8-bbe3-4494-8e9d-711cf1ad819e _client 2a729f00-8185-4832-87e6-ddfe4449ee84 sinceCreation 1028ms sincePrevious 130ms +127ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '7cc7f2d8-7a38-42a7-bac5-98433134b2ad',
            initialToken: '-',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9',
            _user: 'd6e25ce8-bbe3-4494-8e9d-711cf1ad819e',
            _client: '2a729f00-8185-4832-87e6-ddfe4449ee84',
            retriedTimes_int: '-',
            country: 'FR',
            pcType: 'peer',
            iceState: '-',
            iceCandTyp: 'host',
            pcState: '-',
            profileKey: '-'
        });
    });

    it('should parse pcs stats ICE candidate emitted event correctly', () => {
        const fullLog =
            'api:debug:pcs-stats:room ICE candidate n°3 received "candidate:2957543113 1 tcp 1518280447 10.10.254.9 49305 typ host tcptype passive generation 0 ufrag ndmo network-id 13 network-cost 50" |  profileKey audioLow pcType peer token 622d5266-09f6-4ada-97db-1c44021b9ba1 _entity 5da47440-57a9-4823-9564-049abfaa7bdc _user 73b66906-b67e-4ff9-911a-d3d79f1cff66 _client e8a318db-47a1-4fc9-90dc-ae432e8672b6 country FR userAgent "-"';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '622d5266-09f6-4ada-97db-1c44021b9ba1',
            initialToken: '-',
            _entity: '5da47440-57a9-4823-9564-049abfaa7bdc',
            _user: '73b66906-b67e-4ff9-911a-d3d79f1cff66',
            _client: 'e8a318db-47a1-4fc9-90dc-ae432e8672b6',
            retriedTimes_int: '-',
            country: 'FR',
            pcType: 'peer',
            iceState: '-',
            iceCandTyp: 'host',
            pcState: '-',
            profileKey: 'audioLow',
            uaClientName: '-',
            uaIsBrowser: false,
            uaOsName: '-'
        });
    });

    it('should parse pcs stats ready event correctly', () => {
        const fullLog =
            'api:debug:pcs-stats:room ready retriedTimes - token 7cc7f2d8-7a38-42a7-bac5-98433134b2ad _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 _user d6e25ce8-bbe3-4494-8e9d-711cf1ad819e _client 2a729f00-8185-4832-87e6-ddfe4449ee84 sinceCreation 1112ms sincePrevious 84ms +82ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '7cc7f2d8-7a38-42a7-bac5-98433134b2ad',
            initialToken: '-',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9',
            _user: 'd6e25ce8-bbe3-4494-8e9d-711cf1ad819e',
            _client: '2a729f00-8185-4832-87e6-ddfe4449ee84',
            retriedTimes_int: '-',
            country: '-',
            pcType: '-',
            iceState: '-',
            iceCandTyp: '-',
            pcState: '-',
            profileKey: '-'
        });
    });

    it('should parse pcs stats SDP offer event correctly', () => {
        const sdp =
            '"v=0\r\no=mozilla...THIS_IS_SDPARTA-99.0 5385325940746520730 0 IN IP4 0.0.0.0\r\ns=-\r\nt=0 0\r\na=sendrecv\r\na=fingerprint:sha-256 FA:21:D1:AF:BB:98:88:B3:92:FC:8D:70:9F:35:9F:F0:7B:C1:E5:7B:DA:07:BB:03:3D:A3:0A:4D:F6:7E:BC:7F\r\na=group:BUNDLE 0\r\na=ice-options:trickle\r\na=msid-semantic:WMS *\r\nm=video 9 UDP/TLS/RTP/SAVPF 120 124 121 125 126 127 97 98\r\nc=IN IP4 0.0.0.0\r\nb=TIAS:500000\r\na=sendrecv\r\na=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:4 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:5 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:6/recvonly http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\na=extmap:7 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=fmtp:126 profileKey-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1\r\na=fmtp:97 profileKey-level-id=42e01f;level-asymmetry-allowed=1\r\na=fmtp:120 max-fs=12288;max-fr=60\r\na=fmtp:124 apt=120\r\na=fmtp:121 max-fs=12288;max-fr=60\r\na=fmtp:125 apt=121\r\na=fmtp:127 apt=126\r\na=fmtp:98 apt=97\r\na=ice-pwd:414f3525d73b8ad56b26be1d217f67c9\r\na=ice-ufrag:8a82e786\r\na=mid:0\r\na=msid:{18ac372c-f0cf-4715-b6db-a563bb26430e} {ca2bdd9c-1092-40e2-b0b7-316ca904c203}\r\na=rtcp-fb:120 nack\r\na=rtcp-fb:120 nack pli\r\na=rtcp-fb:120 ccm fir\r\na=rtcp-fb:120 goog-remb\r\na=rtcp-fb:120 transport-cc\r\na=rtcp-fb:121 nack\r\na=rtcp-fb:121 nack pli\r\na=rtcp-fb:121 ccm fir\r\na=rtcp-fb:121 goog-remb\r\na=rtcp-fb:121 transport-cc\r\na=rtcp-fb:126 nack\r\na=rtcp-fb:126 nack pli\r\na=rtcp-fb:126 ccm fir\r\na=rtcp-fb:126 goog-remb\r\na=rtcp-fb:126 transport-cc\r\na=rtcp-fb:97 nack\r\na=rtcp-fb:97 nack pli\r\na=rtcp-fb:97 ccm fir\r\na=rtcp-fb:97 goog-remb\r\na=rtcp-fb:97 transport-cc\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:120 VP8/90000\r\na=rtpmap:124 rtx/90000\r\na=rtpmap:121 VP9/90000\r\na=rtpmap:125 rtx/90000\r\na=rtpmap:126 H264/90000\r\na=rtpmap:127 rtx/90000\r\na=rtpmap:97 H264/90000\r\na=rtpmap:98 rtx/90000\r\na=setup:actpass\r\na=ssrc:1659095307 cname:{22a4d39c-a2a6-4c8d-8810-727cc524edc9}\r\na=ssrc:4276004168 cname:{22a4d39c-a2a6-4c8d-8810-727cc524edc9}\r\na=ssrc-group:FID 1659095307 4276004168\r\n"';
        const fullLog = `api:debug:pcs-stats:room SDP Offer sent retriedTimes - token b6933e95-f25d-49a0-bd39-d07a9657863a _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5 _user d6e25ce8-bbe3-4494-8e9d-711cf1ad819e _client 2a729f00-8185-4832-87e6-ddfe4449ee84 sdp ${sdp} +352ms`;
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: 'b6933e95-f25d-49a0-bd39-d07a9657863a',
            initialToken: '-',
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5',
            _user: 'd6e25ce8-bbe3-4494-8e9d-711cf1ad819e',
            _client: '2a729f00-8185-4832-87e6-ddfe4449ee84',
            retriedTimes_int: '-',
            country: '-',
            pcType: '-',
            iceState: '-',
            iceCandTyp: '-',
            pcState: '-',
            profileKey: '-'
        });
    });

    it('should parse pcs stats SDP answer event correctly', () => {
        const sdp =
            '"v=0\r\no=mozilla...THIS_IS_SDPARTA-99.0 1664376999438068 1 IN IP4 54.38.43.211\r\ns=VideoRoom 5496843896859135\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS janus\r\nm=video 9 UDP/TLS/RTP/SAVPF 120 124\r\nc=IN IP4 54.38.43.211\r\na=recvonly\r\na=mid:0\r\na=rtcp-mux\r\na=ice-ufrag:GgfI\r\na=ice-pwd:GJTLQRT/kXtbyQfx9MnH64\r\na=ice-options:trickle\r\na=fingerprint:sha-256 67:0C:77:E2:5D:21:45:88:AF:51:44:ED:07:A7:5B:31:FF:67:13:1B:E9:61:B2:24:28:59:BF:1C:F9:B8:09:01\r\na=setup:active\r\na=rtpmap:120 VP8/90000\r\na=rtcp-fb:120 ccm fir\r\na=rtcp-fb:120 nack\r\na=rtcp-fb:120 nack pli\r\na=rtcp-fb:120 goog-remb\r\na=rtcp-fb:120 transport-cc\r\na=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:6/sendonly http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\na=extmap:7 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=fmtp:120 max-fs=12288;max-fr=60\r\na=rtpmap:124 rtx/90000\r\na=fmtp:124 apt=120\r\na=msid:janus janusv0\r\na=ssrc:1253895611 cname:janus\r\na=ssrc:1253895611 msid:janus janusv0\r\na=ssrc:1253895611 mslabel:janus\r\na=ssrc:1253895611 label:janusv0\r\na=candidate:1 1 udp 2015363327 54.38.43.211 23737 typ host\r\na=end-of-candidates\r\n"';
        const fullLog = `api:debug:pcs-stats:room SDP Answer sent retriedTimes - token a89bc5c2-d645-442b-bd49-9ffa8be702ad _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5 _user d6e25ce8-bbe3-4494-8e9d-711cf1ad819e _client 2a729f00-8185-4832-87e6-ddfe4449ee84 sdp ${sdp} +35ms`;
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: 'a89bc5c2-d645-442b-bd49-9ffa8be702ad',
            initialToken: '-',
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5',
            _user: 'd6e25ce8-bbe3-4494-8e9d-711cf1ad819e',
            _client: '2a729f00-8185-4832-87e6-ddfe4449ee84',
            retriedTimes_int: '-',
            country: '-',
            pcType: '-',
            iceState: '-',
            iceCandTyp: 'host',
            pcState: '-',
            profileKey: '-'
        });
    });

    it('should parse pcs stats deleted event correctly', () => {
        const fullLog =
            'api:debug:pcs-stats:room deleted retriedTimes - token 833b09c3-1c27-4046-ac14-1f178ff6c9e7 _entity 56c2cd0a-7d9e-4b76-85be-944ae3b32ee9 _user d6e25ce8-bbe3-4494-8e9d-711cf1ad819e _client 2a729f00-8185-4832-87e6-ddfe4449ee84 sinceCreation 28020ms sincePrevious 28020ms';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '833b09c3-1c27-4046-ac14-1f178ff6c9e7',
            initialToken: '-',
            _entity: '56c2cd0a-7d9e-4b76-85be-944ae3b32ee9',
            _user: 'd6e25ce8-bbe3-4494-8e9d-711cf1ad819e',
            _client: '2a729f00-8185-4832-87e6-ddfe4449ee84',
            retriedTimes_int: '-',
            country: '-',
            pcType: '-',
            iceState: '-',
            iceCandTyp: '-',
            pcState: '-',
            profileKey: '-'
        });
    });

    it('should parse pcs stats created event correctly', () => {
        const fullLog =
            'api:debug:pcs-stats:room Created retriedTimes 2 initialToken 833b09c3-1c27-4046-ac14-1f178ff6c9e7 token 02010338-170f-40ee-814d-fdc41db86d53 _entity e815eae8-98ad-4dd7-b470-acbccd4db0a5 _user d6e25ce8-bbe3-4494-8e9d-711cf1ad819e _client 2a729f00-8185-4832-87e6-ddfe4449ee84';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '02010338-170f-40ee-814d-fdc41db86d53',
            initialToken: '833b09c3-1c27-4046-ac14-1f178ff6c9e7',
            _entity: 'e815eae8-98ad-4dd7-b470-acbccd4db0a5',
            _user: 'd6e25ce8-bbe3-4494-8e9d-711cf1ad819e',
            _client: '2a729f00-8185-4832-87e6-ddfe4449ee84',
            retriedTimes_int: '2',
            country: '-',
            pcType: '-',
            iceState: '-',
            iceCandTyp: '-',
            pcState: '-',
            profileKey: '-'
        });
    });

    it('should parse pcs stats with browser userAgent correctly', () => {
        const fullLog =
            'api:debug:pcs-stats:room i am a lambda log | userAgent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '-',
            initialToken: '-',
            _entity: '-',
            _user: '-',
            _client: '-',
            retriedTimes_int: '-',
            country: '-',
            pcType: '-',
            iceState: '-',
            iceCandTyp: '-',
            pcState: '-',
            profileKey: '-',
            uaIsBrowser: true,
            uaOsName: 'Mac',
            uaClientName: 'Chrome'
        });
    });

    it('should parse pcs stats with Android mobile userAgent correctly', () => {
        const fullLog = 'api:debug:pcs-stats:room i am a lambda log | userAgent "okhttp/4.9.2"';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '-',
            initialToken: '-',
            _entity: '-',
            _user: '-',
            _client: '-',
            retriedTimes_int: '-',
            country: '-',
            pcType: '-',
            iceState: '-',
            iceCandTyp: '-',
            pcState: '-',
            profileKey: '-',
            uaIsBrowser: false,
            uaOsName: 'Android',
            uaClientName: 'OkHttp'
        });
    });

    it('should parse pcs stats with IOS mobile userAgent correctly', () => {
        const fullLog =
            'api:debug:pcs-stats:room i am a lambda log | userAgent "mycollaborate/90020409 CFNetwork/1498.700.2 Darwin/23.6.0"';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({
            parser: 'room-pcs-stats',
            token: '-',
            initialToken: '-',
            _entity: '-',
            _user: '-',
            _client: '-',
            retriedTimes_int: '-',
            country: '-',
            pcType: '-',
            iceState: '-',
            iceCandTyp: '-',
            pcState: '-',
            profileKey: '-',
            uaIsBrowser: false,
            uaOsName: 'iOS',
            uaClientName: '-'
        });
    });

    it('should return empty object when log is not parseable', () => {
        const fullLog = '2022-09-19T09:12:31.215Z api:info:other coucou';
        const { body: log, head } = prepareLog(fullLog);
        expect(parser(log, head)).toStrictEqual({});
    });
});
