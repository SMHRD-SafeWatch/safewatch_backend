const Stream = require('node-rtsp-stream');

const axios = require('axios');

const apiUrl = 'http://localhost:8090/api/portget';

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const activeStreams = new Map(); // 중복 방지를 위한 스트림 관리 객체

async function fetchData() {
    console.log('fetchData called');
    try {
        // API 호출
        const response = await axios.get(apiUrl)

        const cameras = response.data;

        // `camera_url`과 `port`만 추출한 리스트 생성
        const rtspList = cameras.map(camera => {
            if (!camera.cameraId.includes("API")) {
                return {
                    url: camera.cameraUrl,
                    port: camera.port
                };
            } else {
                return null;
            }
        }).filter(item => item !== null); // null 값 제거
        console.log(activeStreams);
        // 각 스트림에 대해 openStream 함수 호출
        rtspList.forEach(camera => {
            if(!activeStreams.has(camera.port)){
                openStream(camera);
            }
        });

    } catch (error) {

        console.error('데이터 요청 중 오류가 발생했습니다:', error);
    }
}

fetchData();

// rtsp to websocket
function openStream(obj){
        if (activeStreams.has(obj.port) && activeStreams.get(obj.port).isStreamStarted) {
                console.log(`Port ${obj.port} is already active. Skipping stream creation.`);
                return;
            }
        let isStreamStarted = false;
//        console.log(activeStreams);
        let ffmpegOptions = {
                '-stats': ''
            };

            if (obj.port===3008) {
                ffmpegOptions['-b:v'] = '1500k';
                ffmpegOptions['-maxrate'] = '1500k';
                ffmpegOptions['-bufsize'] = '3000k';
            }

            var stream = new Stream({
                name: 'name',
                streamUrl: obj.url,
                wsPort: obj.port,
                ffmpegOptions: ffmpegOptions
            });

            stream.on('camdata', () => {
//                console.log(`Successfully started stream for port ${obj.port}`);
                isStreamStarted = true;
                activeStreams.set(obj.port, { isStreamStarted, stream });
            });

            setTimeout(() => {
                if (!isStreamStarted) {
                    if (stream.wsServer && typeof stream.wsServer.close === 'function') {
                        stream.wsServer.close();
                    }
                    isStreamStarted = false;
                    retryConnection(obj); // 재연결 시도
                }
            }, 5000);

            // 에러 처리 및 스트림 재시작
            stream.mpeg1Muxer.on('exitWithError', () => {
                activeStreams.delete(obj.port);
                if (stream.wsServer && typeof stream.wsServer.close === 'function') {
                    stream.wsServer.close();
                }
                isStreamStarted = false
                retryConnection(obj);
            });

            stream.mpeg1Muxer.on('ffmpegStderr', (data) => {
                data = data.toString();
                if (data.includes('muxing overhead')) {
                    console.log(`포트 ${obj.port}에서 'muxing overhead' 메시지로 인해 스트림이 중지됩니다.`);
                    activeStreams.delete(obj.port);
                    if (stream.wsServer && typeof stream.wsServer.close === 'function') {
                        stream.wsServer.close();
                    }
                    isStreamStarted = false
                    retryConnection(obj);
                }
            });
        }
function retryConnection(obj) {
    const retryInterval = 5000;
    setTimeout(() => {
                openStream(obj);
            }, retryInterval);
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
// npm install axios
// npm install ws

// node src/main/resources/templates/index.js
// 터미널에 입력 node 실행