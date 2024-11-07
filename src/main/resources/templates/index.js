const Stream = require('node-rtsp-stream');

const axios = require('axios');

const apiUrl = 'http://localhost:8084/api/portget';

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const activeStreams = new Set(); // 중복 방지를 위한 스트림 관리 객체

async function fetchData() {
    try {
        // API 호출
        const response = await axios.get(apiUrl);

        const cameras = response.data;

        // `camera_url`과 `port`만 추출한 리스트 생성
        const rtspList = cameras.map(camera => ({
            url: camera.camera_url,
            port: camera.port
        }));

        // 각 스트림에 대해 openStream 함수 호출
        rtspList.forEach(camera => {
            if (!activeStreams.has(camera.port)) {
                openStream(camera);
                activeStreams.add(camera.port);
            }
        });

    } catch (error) {
        console.error('데이터 요청 중 오류가 발생했습니다:', error);
    }
}

// rtsp to websocket
function openStream(obj){
        var stream = new Stream({
                name: 'name',
                streamUrl : obj.url,
                wsPort: obj.port,
                ffmpegOptions: { //ffmpeg 설정
                        '-stats': '', // 통계표시
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

app.get('/api/fetch-data', async (req, res) => {
    try {
        const data = await fetchData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// ffmpeg 설치 : https://ffmpeg.org/

// node src/main/resources/templates/index.js
// 터미널에 입력 node 실행