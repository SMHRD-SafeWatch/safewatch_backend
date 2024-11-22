let portList = [];
let resolvedList = [];

// 데이터를 가져오는 함수
async function fetchCameraData() {
  try {
    // API 요청
    const response = await fetch('http://localhost:8090/api/portget');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // JSON 데이터로 변환
    const cameras = await response.json();

    portList = cameras.map(camera => ({ wsPort: camera.port, cameraId: camera.cameraId, cameraUrl: camera.cameraUrl, section: camera.location }));
    renderVideos();
  } catch (error) {
    console.error('Error fetching camera data:', error);
  }
}

async function fetchResolvedData() {
  try {
    // API 요청
    const response = await fetch('http://localhost:8090/api/resolved');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // JSON 데이터로 변환
    const resolveds = await response.json();

    resolvedList = resolveds.map(resolved => ({
      cameraId: resolved.cameraId,
      detectionId: resolved.detectionId,
      resolved: resolved.resolved
    }));

    // `resolvedList`에서 cameraId별로 그룹화
    const cameraStatusMap = {};
    resolvedList.forEach(item => {
      if (!cameraStatusMap[item.cameraId]) {
        cameraStatusMap[item.cameraId] = { hasResolvedY: false };
      }
      if (item.resolved === 'Y') {
        cameraStatusMap[item.cameraId].hasResolvedY = true;
      }
    });

    // 각 cameraId에 대해 아이콘 변경
    Object.keys(cameraStatusMap).forEach(cameraId => {
      const iconElement = document.getElementById(cameraId + '-icon');
      if (iconElement) {
        if (cameraStatusMap[cameraId].hasResolvedY) {
          // `resolved` 값이 'Y'인 항목이 하나라도 있으면 경고 아이콘으로 변경
          iconElement.src = 'icon/notification_warning.svg';
        } else {
          // 모두 'N'인 경우 기본 아이콘으로 유지
          iconElement.src = 'icon/notification.svg';
        }
      }
    });
  } catch (error) {
    console.error('Error fetching camera data:', error);
  }
}

function startPollingResolvedData(interval = 10000) {
    setInterval(async () => {
        await fetchResolvedData();
    }, interval);
}

// 페이지가 로드되면 데이터 가져오기
window.onload = async () => {
  await fetchResolvedData();
  await fetchCameraData();
  startPollingResolvedData();
};


const modal = document.getElementById("alertModal");
const span = document.getElementsByClassName("close-btn")[0];

let modal_player = null;
let modal_client = null;
const modal_video = document.getElementById("stream");
const title = document.getElementById("modal-title");
const modal_icon = document.getElementById("modal-icon");

// 모달 canvas
function clickModal(port, cameraId, cameraUrl) {
    if (modal_player) {
        modal_player.stop();
        modal_player = null;
    }
    if (modal_client) {
        modal_client.close();
        modal_client = null;
    }
    modal_video.innerHTML = '';

    let stream_video;
    if(!cameraId.includes("API")){
        stream_video = document.createElement('canvas');
        stream_video.id = 'canvasModal';
        stream_video.style.width = "700px";
        stream_video.style.height = "480px";
        modal_video.appendChild(stream_video);

        modal_client = new WebSocket('ws://localhost:' + port);
        modal_player = new jsmpeg(modal_client, { canvas: stream_video });
    }else{
        stream_video = document.createElement("img");
        stream_video.id = 'canvasModal';
        stream_video.style.width = "700px";
        stream_video.style.height = "480px";
        modal_video.appendChild(stream_video);
        title.textContent = cameraId;

        stream_video.src = cameraUrl;
        };

    title.textContent = cameraId;
    const hasResolvedY = resolvedList.some(item => item.cameraId === cameraId && item.resolved === 'Y');
    if (hasResolvedY) {
        modal_icon.src = 'icon/notification_warning.svg'; // 경고 아이콘
    } else {
        modal_icon.src = 'icon/notification.svg'; // 기본 아이콘
    }
    const modal = document.getElementById("alertModal");
    const modalImage = document.getElementById("modalImage");
    modal.style.display = "flex"; // 모달 표시
}

// 모달 닫기 (X 버튼 클릭 시)
span.onclick = function() {
    if (modal_player) {
        modal_player.stop();
        modal_player = null;
    }
    if (modal_client) {
        modal_client.close();
        modal_client = null;
    }
    modal_video.innerHTML = '';
    const modal = document.getElementById("alertModal");
    modal.style.display = "none";

}

// 모달 닫기 (모달 외부 클릭 시)
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        if (modal_player) {
            modal_player.stop();
            modal_player = null;
        }
        if (modal_client) {
            modal_client.close();
            modal_client = null;
        }
        modal_video.innerHTML = '';
    }
}

let currentPage = 1;
const itemsPerPage = 6;
const container = document.getElementById('video-container');

let players = [];
let clients = [];

// ws닫기
function clearExistingResources() {
    if (players.length > 0) {
        players.forEach(player => player.stop());
        players = [];
    }
    if (clients.length > 0) {
        clients.forEach(client => client.close());
        clients = [];
    }
    reconnectAttempts = 0;
}

// ws 핸들러
let reconnectInterval = 3000;
let maxReconnectAttempts = 10;
const reconnectAttemptsMap = new Map();
function createWebSocketConnection(port, canvasElement) {

            if (!reconnectAttemptsMap.has(port)) {
                    reconnectAttemptsMap.set(port, 0);
                }

            const wsClient = new WebSocket('ws://192.168.20.51:' + port);

            wsClient.onopen = function() {
                console.log('WebSocket connection established to port:', port);
                reconnectAttemptsMap.set(port, 0);
                };

            wsClient.onerror = function(err) {
                console.error('WebSocket error on port:', port, err);
            };

            wsClient.onclose = function() {
                const attempts = reconnectAttemptsMap.get(port) || 0;
                // 재연결 시도
                if (reconnectAttemptsMap.get(port) < maxReconnectAttempts) {
                  reconnectAttemptsMap.set(port, attempts + 1);
                  setTimeout(() => createWebSocketConnection(port, canvasElement), reconnectInterval);
                } else {
                  console.error('재연결 시도 횟수를 초과했습니다.');
                  alert('서버와의 연결에 실패했습니다. 이 문제가 계속 발생하면 시스템 관리자에게 문의해 주세요.');
                  reconnectAttemptsMap.delete(port);
                }
            };

            const wsPlayer = new jsmpeg(wsClient, {
                canvas: canvasElement,
                autoplay: true,
            });

            // 연결된 client와 player 저장
            if (!clients.some(client => client.url === `ws://192.168.20.51:${port}`)) {
                clients.push(wsClient);
            }
            if (!players.some(player => player.canvas === canvasElement)) {
                players.push(wsPlayer);
            }
        }

let currentSection = 'section 1';
function changeSection(section) {
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    currentSection = section;
    currentPage = 1;
    renderVideos();
    updatePageInfo();
}

function renderVideos() {
    container.innerHTML = '';
    clearExistingResources();
    const filteredPortList = portList.filter(portObj => portObj.section === currentSection);


    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredPortList.slice(startIndex, endIndex);

    currentItems.forEach((portObj, index) => {
        const divContainer = document.createElement('div');
        divContainer.classList.add('video-card');

        let canvas;
        if(!portObj.cameraId.includes("CAM")){
            canvas = document.createElement('canvas');
            canvas.id = portObj.cameraId;
            canvas.style.width = "306.66px";
            canvas.style.height = "200px";
            canvas.classList.add('canvas-item');
            canvas.onclick = function() {
            clickModal(portObj.wsPort, portObj.cameraId, portObj.cameraUrl);
            };
            createWebSocketConnection(portObj.wsPort, canvas);
        }else{
            canvas = document.createElement("img");
            canvas.id = portObj.cameraId;
            canvas.style.width = "306.66px";
            canvas.style.height = "200px";
            canvas.classList.add('canvas-item');
            canvas.src = portObj.cameraUrl;
            canvas.onclick = function() {
            clickModal(portObj.wsPort, portObj.cameraId, portObj.cameraUrl);

            };
        }

        const videoInfo = document.createElement('div');
        videoInfo.classList.add('video-info');

        const videoIconContainer = document.createElement('div');
        videoIconContainer.classList.add('video-icon-container');

        const videoIcon = document.createElement('img');
        const hasResolvedY = resolvedList.some(item => item.cameraId === portObj.cameraId && item.resolved === 'Y');
        if (hasResolvedY) {
            videoIcon.src = 'icon/notification_warning.svg'; // 경고 아이콘
            videoIcon.id = "notificationwarning"
        } else {
            videoIcon.src = 'icon/notification.svg'; // 기본 아이콘
            videoIcon.id = "notification"
        }
        videoIcon.alt = 'Notification Icon';
        videoIcon.classList.add('video-icon');

        videoIconContainer.appendChild(videoIcon);

        const videoLabel = document.createElement('span');
        videoLabel.textContent = portObj.cameraId;

        videoInfo.appendChild(videoIconContainer);
        videoInfo.appendChild(videoLabel);

        divContainer.appendChild(canvas);
        divContainer.appendChild(videoInfo);
        container.appendChild(divContainer);


    });

    updatePageInfo();
}


function updatePageInfo() {
  const pageInfo = document.getElementById('page-info');
  pageInfo.innerHTML = ''; // 기존 내용 제거

//  const totalPages = Math.ceil(portList.length / itemsPerPage);

  const filteredPortList = portList.filter(portObj => portObj.section === currentSection);
  const totalPages = Math.ceil(filteredPortList.length / itemsPerPage);
  // 페이지 1개 이하면
  if (totalPages <= 1) {
      return; // 페이지네이션 버튼을 생성하지 않고 종료
  }

  // 이전 버튼 추가
  const prevButton = document.createElement('li');
  const prevLink = document.createElement('a');
  prevLink.textContent = '◀';
  prevLink.classList.add('pagination-link');
  if (currentPage === 1) {
    //   prevLink.classList.add('disabled');
  } else {
      prevLink.onclick = (event) => {
          event.preventDefault();
          if (currentPage > 1) {
              currentPage--;
              clearExistingResources();
              renderVideos();
              updatePageInfo(); // 페이지 정보 갱신
          }
      };
  }
  prevButton.appendChild(prevLink);
  pageInfo.appendChild(prevButton);

  // 페이지 번호 버튼 추가
  for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('li');
      const pageLink = document.createElement('a');
      pageLink.textContent = i;
      if (i === currentPage) {
          pageLink.classList.add('active'); // 현재 페이지 스타일 추가
      } else {
          pageLink.onclick = (event) => {
              event.preventDefault();
              clearExistingResources();
              currentPage = i;
              renderVideos();
              updatePageInfo(); // 페이지 정보 갱신
          };
      }
      pageButton.appendChild(pageLink);
      pageInfo.appendChild(pageButton);
  }

  // 다음 버튼 추가
  const nextButton = document.createElement('li');
  const nextLink = document.createElement('a');
  nextLink.textContent = '▶';
  nextLink.classList.add('pagination-link');
  if (currentPage === totalPages) {
    //   nextLink.classList.add('disabled');
  } else {
      nextLink.onclick = (event) => {
          event.preventDefault();
          if (currentPage < totalPages) {
              clearExistingResources();
              currentPage++;
              renderVideos();
              updatePageInfo(); // 페이지 정보 갱신
          }
      };
  }
  nextButton.appendChild(nextLink);
  pageInfo.appendChild(nextButton);
}

document.getElementById('events-button').addEventListener('click', function() {
    window.location.replace('http://localhost:8090/detectevt');
});

document.getElementById('video-container').addEventListener('click', function(event) {
    if (event.target && event.target.id === 'notificationwarning') {
        window.location.href = 'http://localhost:8090/detectevt';
    }
});
