const Stream = require('node-rtsp-stream');
// npm install oracledb
const oracledb = require("oracledb")

// rtsp 리스트 처리
var rtspList = [
        {"url":'rtsp://210.99.70.120:1935/live/cctv048.stream',"port":3001, "stream":null},
        {"url":'rtsp://210.99.70.120:1935/live/cctv047.stream',"port":3002, "stream":null},
        {"url":'rtsp://210.99.70.120:1935/live/cctv046.stream',"port":3003, "stream":null},
        {"url":'rtsp://210.99.70.120:1935/live/cctv045.stream',"port":3004, "stream":null},
        {"url":'rtsp://210.99.70.120:1935/live/cctv044.stream',"port":3005, "stream":null},
        {"url":'rtsp://210.99.70.120:1935/live/cctv043.stream',"port":3006, "stream":null},
        {"url":'rtsp://210.99.70.120:1935/live/cctv042.stream',"port":3007, "stream":null},
        {"url":'rtsp://210.99.70.120:1935/live/cctv041.stream',"port":3008, "stream":null},
        {"url":'rtsp://210.99.70.120:1935/live/cctv040.stream',"port":3009, "stream":null},
        {"url":'rtsp://210.99.70.120:1935/live/cctv039.stream',"port":3010, "stream":null},
        {"url":'rtsp://210.99.70.120:1935/live/cctv038.stream',"port":3011, "stream":null},
];

var rtspListLength = rtspList.length;
for(var i=0; i<rtspListLength; i++){
        openStream(rtspList[i]);

}

// rtsp to websocket
function openStream(obj){
        var stream = new Stream({
                name: 'name',
                streamUrl : obj.url,
                wsPort: obj.port,
                ffmpegOptions: { //ffmpeg 설정
                        '-stats': '', // 통계표시
                        '-r': 30, // 프레임 속도 설정
                }
        });

        // 에러 처리 및 스트림 재시작
        stream.mpeg1Muxer.on('exitWithError',()=>{
                stream.stop();
                openStream(obj);
        });

        stream.mpeg1Muxer.on('ffmpegStderr', (data)=>{
                data = data.toString();
                if(data.includes('muxing overhead')){
                        stream.stop();
                        openStream(obj);
                }
        });
}

// websocket 설정
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8082 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received:', message);
        ws.send('Hello from server');
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8082');

// ffmpeg 설치 : https://ffmpeg.org/

// node_modules -> node-rtsp-stream -> mpeg1muxer.js 설정 확인
/*this.spawnOptions = [
      "-rtsp_transport", "tcp", "-i",
      this.url,
      '-f',
      'mpeg1video',
      '-b:v', '1000k',
      '-maxrate', '1000k',
      '-bufsize', '1000k',
      '-an', '-r', '24',
      // additional ffmpeg options go here
      ...this.additionalFlags,
      '-'
    ]*/

// node src/main/resources/templates/index.js
// 터미널에 입력 node 실행