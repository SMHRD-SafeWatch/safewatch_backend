function openPopup(level) {
    let alertSound;
    if (level === "매우 위험") {
        alertSound = document.getElementById("alertSound01");
    } else if (level === "위험") {
        alertSound = document.getElementById("alertSound02");
    } else if (level === "주의") {
        alertSound = document.getElementById("alertSound03");
    }

    const width = 850;
    const height = 447;

    // 화면 중앙 위치
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2 - 42;

    const popupWindow = window.open(
        `/html/warning_popup.html?level=${encodeURIComponent(level)}`,
        "_blank",
        `width=${width},height=${height},left=${left},top=${top}`
    );

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
}
