var socket = new SockJS('/ws');
var stompClient = Stomp.over(socket);

var currentDetectionId = null;
var detectionTimeout = null; // 타이머를 저장할 변수

let currentAlertSound = null; // 현재 재생 중인 소리 변수
let userInteracted = false; // 사용자가 상호작용했는지 여부 추적

// 사용자 상호작용 감지 (한 번만 실행됨)
document.body.addEventListener("click", () => {
    userInteracted = true; // 사용자 상호작용 플래그 설정
  });

// 타이머를 이용해 currentDetectionId를 초기화하는 함수
function resetCurrentDetectionId() {
    currentDetectionId = null;
}



function handleImageClick(imgElement) {
    // 이미지 데이터와 기타 속성 읽기
    const imageUrl = imgElement.getAttribute("src"); // Base64 이미지 URL
    const location = imgElement.getAttribute("data-location");
    const cameraId = imgElement.getAttribute("data-camera-id");
    const detectionTime = imgElement.getAttribute("data-detection-time");
    const content = imgElement.getAttribute("data-content");
    const riskLevel = imgElement.getAttribute("data-risk-level");

    // 이미지 클릭 처리 로직 실행
    updateAlertModalContent(imageUrl, location, cameraId, detectionTime, content, riskLevel);
}



function updateAlertModalContent(imageUrl, location, cameraId, detectionTime, content, riskLevel) {
    // 모달 DOM 요소 가져오기
    const modal = document.getElementById('alertModal'); // 'alertModal' ID를 가진 요소 가져오기
    const modalImage = modal.querySelector('#modalImage'); // 모달의 이미지 요소
    // 모달 업데이트
    modalImage.src = imageUrl; // Base64 이미지 설정
    document.getElementById('modalContent').textContent = content || 'N/A';
    document.getElementById('modalLocation').textContent = location || 'N/A';
    document.getElementById('modalCameraId').textContent = cameraId || 'N/A';
    document.getElementById('modalDate').textContent = detectionTime ? detectionTime.split(' ')[0] : 'N/A';
    document.getElementById('modalTime').textContent = detectionTime ? detectionTime.split(' ')[1] : 'N/A';

    // 모달 표시
    modal.style.display = 'flex';

    const popupTitle2 = document.getElementById("alertText2");
    popupTitle2.textContent = `위험 수준: ${riskLevel}`;

    if (popupTitle2 && riskLevel) {
        let beforeColor;
        let textColor2;
        if (riskLevel === "HIGH") {
            beforeColor = "#FF4500"; // 빨강
            textColor2 = "#FF4500"; // 텍스트 색상
        } else if (riskLevel === "MEDIUM") {
            beforeColor = "#FFD700"; // 노랑
            textColor2 = "#FFD700";
        } else {
            beforeColor = "gray"; // 기본 회색
            textColor2 = "gray";
        }
    modal.style.setProperty('--modal-before-color', beforeColor);

    popupTitle2.style.color = textColor2;
    }
}

// 새로 고침시 localStorage 데이터 초기화
window.addEventListener("load", () => {
    // localStorage 초기화
    localStorage.removeItem("alertData");
    console.log("localStorage 초기화 완료");
});


stompClient.connect({}, function (frame) {
    stompClient.subscribe('/topic/alerts', function (message) {

        var alertData = JSON.parse(message.body);
        localStorage.removeItem("alertData");

        document.getElementById("detectionSizeDisplay").textContent = alertData.detectionSize;
//        console.log(document.getElementById("detectionSizeDisplay")); // null이 아니어야 합니다.

        console.log("전체 메시지 데이터:", alertData); // 메시지 전체 확인


        if (!alertData || !alertData.riskLevel || !alertData.imageUrl) {
            console.log("유효하지 않은 WebSocket 데이터:", alertData);
            return; // 데이터가 유효하지 않으면 처리 중단
        }

        console.log("새로운 알림 데이터:", alertData);

        console.log("WebSocket 연결 상태:", stompClient.connected);

        currentDetectionId = alertData.detectionId;

        if (detectionTimeout) clearTimeout(detectionTimeout);
        detectionTimeout = setTimeout(() => {
            currentDetectionId = null;
        }, 5000);

        localStorage.setItem("alertData", JSON.stringify(alertData));


        if(alertData.riskLevel === 'LOW') return;

         try {
        // 팝업에 데이터 표시
        document.getElementById("popupImage").src = "data:image/jpeg;base64," + alertData.imageUrl;
        document.getElementById("popupCameraId").textContent = alertData.cameraId;
        document.getElementById("popupCameraId").setAttribute("data-detection-id", alertData.detectionId);
        const dateTimeParts = new Date(alertData.detectionTime).toLocaleString().split(' ');

        const date = `${dateTimeParts[0]} ${dateTimeParts[1]} ${dateTimeParts[2]}`;
        const time = `${dateTimeParts[3]} ${dateTimeParts[4]}`;

        document.getElementById('popupDetectionDate').textContent = date;
        document.getElementById("popupDetectionTime").textContent = time;

        document.getElementById("popupContent").textContent = alertData.content;
        document.getElementById("popupLocation").textContent = alertData.location;

        const level = alertData.riskLevel;
        const popupTitle = document.getElementById("popupText2");
        const modalElement = document.getElementById("alertPopup"); // 다른 모달 컨테이너

        popupTitle.textContent = `위험 수준: ${level}`;

        if (popupTitle && level) {
            let textColor;
            let beforeColor;

            if (level === "HIGH") {
                beforeColor = "#FF4500"; // 빨강
                textColor = "#FF4500";
            } else if (level === "MEDIUM") {
                beforeColor = "#FFD700"; // 노랑
                textColor = "#FFD700";
            } else {
                beforeColor = "gray"; // 기본 회색
                textColor = "gray";
            }

            // 특정 모달 컨테이너에만 스타일 적용
            modalElement.style.setProperty('--modal-before-color', beforeColor);

            // 텍스트 색상 적용
            popupTitle.style.color = textColor;
            }
            showAlertPopup();

            } catch (error) {
            console.error("모달 데이터 처리 중 오류 발생. 다음 데이터로 넘어감:", error);
            currentDetectionId = null; // 다음 데이터 처리 준비
        }
     });
});


function showAlertPopup() {
        // 모달을 열기 전에 데이터 유효성 검사
    const popupContent = document.getElementById("popupContent").textContent.trim();
    const popupImage = document.getElementById("popupImage").src;

    if (!popupContent || popupContent === "N/A") {
        console.log("유효하지 않은 데이터로 인해 모달을 표시하지 않습니다.");
        return; // 유효하지 않은 데이터면 모달 열지 않음
    }

    if (!popupImage || popupImage.includes("placeholder.png")) {
        console.log("이미지가 없어서 모달을 표시하지 않습니다.");
        return; // 이미지가 없을 경우에도 모달 열지 않음
    }


    const level = document.getElementById("popupText2").textContent.split(':')[1].trim(); // 위험 수준 추출
    if (level === "HIGH") {
        currentAlertSound = document.getElementById("alertSound01");
    } else if (level === "MEDIUM") {
        currentAlertSound = document.getElementById("alertSound02");
    } else {
        currentAlertSound = document.getElementById("alertSound03");
    }

    // 사용자 상호작용이 발생한 경우에만 play() 호출
    if (userInteracted && currentAlertSound) {
        currentAlertSound.loop = true;
        currentAlertSound.currentTime = 0;
        currentAlertSound.play().catch((error) => {
            console.error("오디오 재생 오류:", error);
        });
    }


    document.getElementById("alertPopup").style.display = "flex"; // alertPopup 표시
}

function showConfirmPopup() {
    document.getElementById("secondConfirmModal").style.display = "block"; // secondConfirmModal 표시
}


document.addEventListener("DOMContentLoaded", function () {
    // 초기 데이터 로드
    fetch('/detections')
        .then(response => response.json())  // 서버에서 데이터를 JSON 형식으로 받음
        .then(data => {
            updateTable(data);  // 테이블 업데이트
        })
        .catch(error => console.error("Error fetching detections:", error));
});

function closeSecondConfirmModal() {
    document.getElementById("secondConfirmModal").style.display = "none"; // secondConfirmModal 숨김

    fetch('/detections') // 서버에서 데이터를 가져올 엔드포인트
        .then(response => response.json()) // JSON으로 응답 처리
        .then(data => {
            setTimeout(() => {
            updateTable(data);
        }, 0);
        })
        .catch(error => {
            console.error('Error fetching detections:', error);
        });

    if (currentAlertSound) {
        currentAlertSound.pause(); // 소리 정지
        currentAlertSound.currentTime = 0; // 초기화
        currentAlertSound.loop = false; // 반복 제거
        currentAlertSound = null; // 변수 초기화
    }


    var storedAlertData = localStorage.getItem("alertData");
    if (storedAlertData) {
        var alertData = JSON.parse(storedAlertData);
        if (!alertData.detectionId || alertData.resolved === 'Y') {
            console.log("유효하지 않은 데이터, 처리 중지");
            localStorage.removeItem("alertData");
            return;
        }

        ;

        var detectionId = document.getElementById("popupCameraId").getAttribute("data-detection-id");

        console.log("DetectionId from popup:", detectionId);

        if (!detectionId) {
                console.error("DetectionId is null or undefined.");
                return;
            }

         if (currentDetectionId === detectionId) {
            console.log("중복 요청 방지: " + detectionId);
            return; // 이미 처리 중인 요청이라면 실행 중단
        }
        currentDetectionId = detectionId;


        // AJAX 요청으로 Spring Boot에 detectionId 전송
        fetch('/resolveWarning?detectionId=' + detectionId, {
            method: 'PUT'
        })
            .then(response => response.text())
            .then(data => {
                console.log("Resolve Warning Response:", data);
                localStorage.removeItem("alertData"); // 처리된 데이터 제거
                document.getElementById("alertPopup").style.display = "none";
//                    location.reload(true); // 새로고침


            })
            .catch(error => {
                console.error("AJAX 요청 오류:", error);
                // 오류 발생 시 currentDetectionId 초기화
                currentDetectionId = null;
            })
            .finally(()=>{
               currentDetectionId = null;
            });
        }
    }


function closeAlertModal(){
    document.getElementById("alertModal").style.display = "none";
}


// "확인" 컬럼이 N인 행에 클래스 추가
const tableRows = document.querySelectorAll(".table tbody tr");
tableRows.forEach(row => {
    const confirmCell = row.cells[row.cells.length - 1]; // 마지막 cell (확인 컬럼)
    if (confirmCell.textContent.trim() === 'N') {
        row.classList.add("dark-row");
    }
});

// Warning - 이미지 클릭시
const images = document.querySelectorAll(".thumbnail");
images.forEach(img => {
    img.addEventListener("click", function () {
        openModal(this.src);
    });
});

function openModal(imageSrc) {
    const modal = document.getElementById("alertModal");
    const modalImage = document.getElementById("modalImage");
    modalImage.src = imageSrc; // 클릭한 이미지 소스를 모달에 적용
    modal.style.display = "flex"; // 모달 표시
}

function closeModal() {
    const modal = document.getElementById("alertModal");
    modal.style.display = "none";
}

// 페이지 당 표시할 갯수
const pageSize = 5;
let currentPage = 0;
let rows = [];
let totalPages;

function resetPagination() {
  rows = document.querySelectorAll("tbody tr");
  const totalRows = rows.length;
  totalPages = Math.ceil(totalRows / pageSize);

  if (totalPages > 1) {
    showPage(currentPage);
    showPageGroup(currentPage); // 페이지 그룹을 보여주는 함수 호출
  } else {
    document.getElementById("prevButton").disabled = true;
    document.getElementById("nextButton").disabled = true;
  }
}

// 페이지를 표시하는 함수
function showPage(page) {
  rows.forEach((row, index) => {
    row.style.display = (index >= page * pageSize && index < (page + 1) * pageSize) ? "" : "none";
  });

  document.getElementById("prevButton").disabled = (page === 0);
  document.getElementById("nextButton").disabled = (page >= totalPages - 1);
}

// 페이지 그룹을 표시하는 함수 - 추가된 부분
function showPageGroup(page) {
  const paginationNumbers = document.getElementById("paginationNumbers");
  paginationNumbers.innerHTML = ""; // 기존 번호 초기화

  const groupSize = 5; // 페이지 그룹 크기
  const startPage = Math.floor(page / groupSize) * groupSize;
  const endPage = Math.min(startPage + groupSize, totalPages);

  for (let i = startPage; i < endPage; i++) {
    const pageItem = document.createElement("li"); // li 태그 생성
    pageItem.style.display = "inline"; // 각 li 요소가 가로로 표시되도록 설정
    const pageLink = document.createElement("a");

    pageLink.href = "javascript:void(0);";
    pageLink.textContent = i + 1;
    if (i === currentPage) {
      pageLink.classList.add("active"); // 현재 페이지 강조
    }

    pageLink.addEventListener("click", function () {
      currentPage = i;
      showPage(currentPage);
      showPageGroup(currentPage);
    });

    pageItem.appendChild(pageLink); // li에 a를 넣기
    paginationNumbers.appendChild(pageItem); // ul에 li 추가
  }
}



// 이전 페이지 함수
function previousPage() {
  if (currentPage > 0) {
    currentPage--;
    showPage(currentPage);
    showPageGroup(currentPage);
  }
}

// 다음 페이지 함수
function nextPage() {
  if (currentPage < totalPages - 1) {
    currentPage++;
    showPage(currentPage);
    showPageGroup(currentPage);
  }
}



// 테이블 업데이트 함수
function updateTable(detections) {
    const tableBody = document.querySelector('tbody'); // tbody 요소 선택
    tableBody.innerHTML = ''; // 기존 테이블 내용 초기화

    detections.forEach(detection => {
        // 새로운 행 생성
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${detection.riskLevel || ''}</td>
            <td>
                ${
                    detection.imageUrlBase64
                            ? `<img src="data:image/jpeg;base64,${detection.imageUrlBase64}" alt="Detection Image" width="175"
                                   data-risk-level="${detection.riskLevel || ''}"
                                   data-detection-time="${detection.formattedDetectionTime || ''}"
                                   data-location="${detection.cameraInstall?.location || ''}"
                                   data-camera-id="${detection.cameraInstall?.cameraId || ''}"
                                   data-content="${detection.content || ''}"
                                   onclick="handleImageClick(this)" />`
                            : `<img src="/images/placeholder.png" alt="No Image Available" width="100" />`
                        }
                    </td>
                    <td>${detection.formattedDetectionTime || ''}</td>
                    <td>${detection.content || ''}</td>
                    <td>${detection.location || ''}</td>
                    <td>${detection.cameraId || ''}</td>
                    <td>${detection.resolved || ''}</td>
                `;



                tableBody.appendChild(row);
            });
             resetPagination();
        }