const Stream = require('node-rtsp-stream');

// npm install oracledb
const oracledb = require("oracledb")
const express = require('express');
const app = express();
const port = 3000;

const dbConfig = {
  user: 'Insa5_SpringB_final_3',
  password: 'aischool3',
  connectString: 'project-db-stu3.smhrd.com:1524/xe'
};

// 스트림 관리를 위한 전역 변수
let activeStreams = {};

app.get('/api/users/:id', (req, res) => {
    let connection;

      try {
        // Oracle DB에 연결
        connection = await oracledb.getConnection(dbConfig);

        // RTSP 정보를 가져오는 SQL 쿼리 실행 (테이블과 컬럼명은 실제 구조에 맞게 수정)
        const result = await connection.execute(
          `SELECT url, port FROM camera_install WHERE admin_id = :id`,
          { id: streamId }
        );

        // 결과가 존재하는지 확인
        if (result.rows.length > 0) {
          const [url, port, name] = result.rows[0];

          // 이미 동일한 스트림이 활성화되어 있는지 확인
          if (activeStreams[streamId]) {
            res.status(200).send(`Stream for ID ${streamId} is already active.`);
            return;
          }

          // 스트리밍 시작
          openStream(streamId, url, port);
          res.status(200).send(`Stream for ID ${streamId} started successfully.`);

        } else {
          res.status(404).send('Stream ID not found in the database');
        }

      } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Database connection error');
      } finally {
        if (connection) {
          try {
            // 연결 종료
            await connection.close();
          } catch (err) {
            console.error('Error closing connection:', err);
          }
        }
      }
});
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
        {"url":'rtsp://safewatch:123456@192.168.20.17/stream1',"port":3012, "stream":null}
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