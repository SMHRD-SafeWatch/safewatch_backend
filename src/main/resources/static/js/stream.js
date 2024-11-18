let portList = [];

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

    portList = cameras.map(camera => ({ wsPort: camera.port, cameraId: camera.cameraId }));
    renderVideos();
  } catch (error) {
    console.error('Error fetching camera data:', error);
  }
}

// 페이지가 로드되면 데이터 가져오기
window.onload = fetchCameraData;

const modal = document.getElementById("alertModal");
const span = document.getElementsByClassName("close-btn")[0];

let modal_player = null;
let modal_client = null;
const modal_video = document.getElementById("stream");
const title = document.getElementById("modal-title");

function clickModal(port, cameraId) {
    if (modal_player) {
        modal_player.stop();
        modal_player = null;
    }
    if (modal_client) {
        modal_client.close();
        modal_client = null;
    }
    modal_video.innerHTML = '';

    const stream_video = document.createElement('canvas');
    stream_video.id = 'canvasModal';
    stream_video.style.width = "700px";
    stream_video.style.height = "480px";
    modal_video.appendChild(stream_video);
    title.textContent = cameraId;

    modal_client = new WebSocket('ws://localhost:' + port);
    modal_player = new jsmpeg(modal_client, { canvas: stream_video });
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

function clearExistingResources() {
    if (players.length > 0) {
        players.forEach(player => player.stop());
        players = [];
    }
    if (clients.length > 0) {
        clients.forEach(client => client.close());
        clients = [];
    }
}

function createWebSocketConnection(port, canvasElement) {
            const wsClient = new WebSocket('ws://localhost:' + port);

            wsClient.onopen = function() {
                console.log('WebSocket connection established to port:', port);
            };

            wsClient.onerror = function(err) {
                console.error('WebSocket error on port:', port, err);
            };

//            wsClient.onclose = function() {
//                setTimeout(() => {
//                    createWebSocketConnection(port, canvasElement);
//                }, 5000);
//            };

            const wsPlayer = new jsmpeg(wsClient, {
                canvas: canvasElement,
                autoplay: true,
            });

            // 연결된 client와 player 저장
            clients.push(wsClient);
            players.push(wsPlayer);
        }

function renderVideos() {
    container.innerHTML = '';
    clearExistingResources();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = portList.slice(startIndex, endIndex);

    currentItems.forEach((portObj, index) => {
        const divContainer = document.createElement('div');
        divContainer.classList.add('video-card');

        const canvas = document.createElement('canvas');
        canvas.id = 'canvas' + index;
        canvas.style.width = "400px";
        canvas.style.height = "200px";
        canvas.classList.add('canvas-item');
        canvas.onclick = function() {
            clickModal(portObj.wsPort, portObj.cameraId);
        };

        const videoInfo = document.createElement('div');
        videoInfo.classList.add('video-info');

        const videoIconContainer = document.createElement('div');
        videoIconContainer.classList.add('video-icon-container');

        const videoIcon = document.createElement('img');
        videoIcon.src = 'icon/notification.svg';
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

        createWebSocketConnection(portObj.wsPort, canvas);

    });

    updatePageInfo();
}


function updatePageInfo() {
  const pageInfo = document.getElementById('page-info');
  pageInfo.innerHTML = ''; // 기존 내용 제거

  const totalPages = Math.ceil(portList.length / itemsPerPage);

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