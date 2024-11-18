var socket = new SockJS('/ws');
var stompClient = Stomp.over(socket);

var currentDetectionId = null;
var detectionTimeout = null; // 타이머를 저장할 변수

// 타이머를 이용해 currentDetectionId를 초기화하는 함수
function resetCurrentDetectionId() {
    currentDetectionId = null;
}

stompClient.connect({}, function (frame) {
    stompClient.subscribe('/topic/alerts', function (message) {
        console.log("수신된 메시지:", message.body);

        var alertData = JSON.parse(message.body);

        if (alertData.resolved === 'Y') {
                console.log("이미 처리된 데이터 무시:", alertData.detectionId);
                return;
            }

        console.log("새로운 알림 데이터:", alertData);

        console.log("WebSocket 연결 상태:", stompClient.connected);

        if (currentDetectionId === alertData.detectionId) return;

        currentDetectionId = alertData.detectionId;

        if (detectionTimeout) clearTimeout(detectionTimeout);
        detectionTimeout = setTimeout(() => {
            currentDetectionId = null;
        }, 5000);

        localStorage.setItem("alertData", JSON.stringify(alertData));

        // 팝업에 데이터 표시
        document.getElementById("popupImage").src = "data:image/jpeg;base64," + alertData.imageUrl;
        document.getElementById("popupCameraId").textContent = alertData.cameraId;
        document.getElementById("popupCameraId").setAttribute("data-detection-id", alertData.detectionId);
        document.getElementById("popupDetectionTime").textContent = new Date(alertData.detectionTime).toLocaleString();
        document.getElementById("popupContent").textContent = alertData.content;
        document.getElementById("popupLocation").textContent = alertData.location;

        showAlertPopup();
    });
});

function showAlertPopup() {
    document.getElementById("alertPopup").style.display = "flex"; // alertPopup 표시
}

function showConfirmPopup() {
    document.getElementById("secondConfirmModal").style.display = "block"; // secondConfirmModal 표시
}

function closeSecondConfirmModal() {
    document.getElementById("secondConfirmModal").style.display = "none"; // secondConfirmModal 숨김

    var storedAlertData = localStorage.getItem("alertData");
    if (storedAlertData) {
        var alertData = JSON.parse(storedAlertData);

        if (alertData.resolved === 'Y') {
            localStorage.removeItem("alertData");
        } else {
            var detectionId = document.getElementById("popupCameraId").getAttribute("data-detection-id");

            // AJAX 요청으로 Spring Boot에 detectionId 전송
            fetch('/resolveWarning?detectionId=' + detectionId, {
                method: 'PUT'
            })
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    localStorage.removeItem("alertData"); // 처리된 데이터 제거
                    location.reload(true); // 새로고침
                })
                .catch(error => console.error('Error:', error));
        }
    }
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

document.addEventListener("DOMContentLoaded", function () {
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
});

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