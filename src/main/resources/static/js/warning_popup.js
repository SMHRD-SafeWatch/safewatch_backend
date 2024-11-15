document.addEventListener("DOMContentLoaded", function() {
    // URL 파라미터로 경고 레벨을 가져와 제목에 표시
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');
    const alertPopup = document.getElementById("alertPopup");
    const popupTitle = document.getElementById("popupTitleText");
    const confirmButton = document.getElementById("confirmButton"); // 첫 번째 확인 버튼
    const closeConfirmButton = document.getElementById("closeConfirmButton"); // 두 번째 확인 버튼

    // level 값에 따라 제목과 스타일 설정
    if (popupTitle && level) {
        popupTitle.textContent = level;

        if (level === "매우 위험") {
            alertPopup.classList.add("popup-high");
        } else if (level === "위험") {
            alertPopup.classList.add("popup-medium");
        } else if (level === "주의") {
            alertPopup.classList.add("popup-low");
        }
    }

    if (confirmButton) {
        confirmButton.addEventListener("click", openConfirmAlert);
    }

    if (closeConfirmButton) {
        closeConfirmButton.addEventListener("click", function() {
            closeConfirmAlert();
            window.close();
        });
    }
});

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
    }
}
