// 페이지 로드 시 localStorage에서 데이터 가져오기
window.addEventListener("load", function () {
    const storedAlertData = localStorage.getItem("alertData");
    if (storedAlertData) {
        const alertData = JSON.parse(storedAlertData);
        updateWarningPopup(alertData);
    }
});

// alertDataReceived 이벤트 처리
window.addEventListener("alertDataReceived", function (event) {
    const alertData = event.detail;
    console.log("Popup에서 받은 데이터:", alertData);
    updateWarningPopup(alertData);
});

// warning_popup.html에 데이터를 업데이트하는 함수
function updateWarningPopup(alertData) {
    if (!alertData) return;

    document.getElementById("popupTitleText").textContent = alertData.riskLevel;
    document.getElementById("popupLocation").textContent = alertData.location;
    document.getElementById("popupCameraId").textContent = alertData.cameraId;
    document.getElementById("popupDetectionTime").textContent = new Date(alertData.detectionTime).toLocaleString();
    document.getElementById("popupContent").textContent = alertData.content;

    // 이미지 업데이트
    const popupImage = document.getElementById("popupImage");
    if (alertData.imageUrl) {
        popupImage.src = `data:image/jpeg;base64,${alertData.imageUrl}`;
    } else {
        popupImage.src = "/img/ex_01.png"; // 기본 이미지 경로
    }

    // 스타일 변경
    const alertPopup = document.getElementById("alertPopup");
    alertPopup.className = ""; // 기존 클래스 초기화
    if (alertData.riskLevel === "HIGH") {
        alertPopup.classList.add("popup-high");
    } else if (alertData.riskLevel === "MEDIUM") {
        alertPopup.classList.add("popup-medium");
    } else if (alertData.riskLevel === "LOW") {
        alertPopup.classList.add("popup-low");
    }

    // 경고 사운드 설정
    playAlertSound(alertData.riskLevel);
}

let alertSound;
if (level === "HIGH") {
    alertSound = document.getElementById("alertSound01");
} else if (level === "MEDIUM") {
    alertSound = document.getElementById("alertSound02");
} else if (level === "LOW") {
    alertSound = document.getElementById("alertSound03");
}



if (alertSound) {
    alertSound.loop = true;
    alertSound.currentTime = 0;
    alertSound.play();

    // 닫힐 때 소리 중지
    const interval = setInterval(() => {
        if (popupWindow.closed) {
            alertSound.pause();
            alertSound.currentTime = 0;
            alertSound.loop = false;
            clearInterval(interval);
        }
    }, 500);
}

window.addEventListener("load", function () {
  var storedAlertData = localStorage.getItem("alertData");
  if (storedAlertData) {
      var alertData = JSON.parse(storedAlertData);

      // 알림 데이터를 화면에 표시
      if (alertData.riskLevel === "HIGH" || alertData.riskLevel === "MEDIUM") {


          document.getElementById("popupImage").src = alertData.imageUrl;
          document.getElementById("popupCameraId").textContent = alertData.cameraId;
          document.getElementById("popupDetectionTime").textContent = new Date(alertData.detectionTime).toLocaleString();
          document.getElementById("popupContent").textContent = alertData.content;
          document.getElementById("popupLocation").textContent = alertData.location;

      // level 값에 따라 제목과 스타일 설정
      if (popupTitle && level) {
          popupTitle.textContent = level;

          if (level === "HIGH") {
              alertPopup.classList.add("popup-high");
          } else if (level === "MEDIUM") {
              alertPopup.classList.add("popup-medium");
          } else if (level === "LOW") {
              alertPopup.classList.add("popup-low");
          }
      }

  }

  }
});

// URL 파라미터로 경고 레벨을 가져와 제목에 표시
const alertPopup = document.getElementById("alertPopup");
const popupTitle = document.getElementById("popupTitleText");
const confirmButton = document.getElementById("confirmButton"); // 첫 번째 확인 버튼
const closeConfirmButton = document.getElementById("closeConfirmButton"); // 두 번째 확인 버튼



if (confirmButton) {
    confirmButton.addEventListener("click", openConfirmAlert);
}

if (closeConfirmButton) {
    closeConfirmButton.addEventListener("click", function() {
        closeConfirmAlert();
        window.close();
    });
}


// 확인용 Alert 창
function openConfirmAlert() {
    const confirmAlertPopup = document.getElementById("confirmAlertPopup");
    if (confirmAlertPopup) {
        confirmAlertPopup.style.display = "flex";
        overlay.style.display = "block";
    }
}

function closeConfirmAlert() {
    const confirmAlertPopup = document.getElementById("confirmAlertPopup");
    if (confirmAlertPopup) {
        confirmAlertPopup.style.display = "none";
        overlay.style.display = "none";
        var storedAlertData = localStorage.getItem("alertData");
        if (storedAlertData) {
            var alertData = JSON.parse(storedAlertData);
            var detectionId = alertData.detectionId;

            // AJAX 요청으로 Spring Boot에 detectionId 전송
            fetch('/resolveWarning?detectionId=' + detectionId, {
                method: 'PUT'
            })
            .then(response => response.text())
            .then(data => {
                // 팝업을 띄운 후 localStorage에서 데이터 제거
                localStorage.removeItem("alertData");
                location.reload(true);

            })
            .catch(error => console.error('Error:', error));
        }
    }
}


function updatePopupImage(alertData) {
    const popupImage = document.getElementById("popupImage");

    if (alertData.imageUrl) {
        // Base64 이미지가 있으면 설정
        popupImage.src = `data:image/jpeg;base64,${alertData.imageUrl}`;
    } else {
        // Base64 값이 없으면 기본 이미지로 대체
        popupImage.src = "/img/ex_01.png"; // 기본 이미지 경로 설정
    }
}