function openModal(level) {
    const modal = document.getElementById("alertModal");
    const modalTitle = document.getElementById("modalTitle");

    // 모달 제목 설정
    modalTitle.textContent = level;

    // 기존 위험 수준 클래스 제거
    modal.classList.remove("modal-danger", "modal-warning", "modal-low");

    // 위험 수준에 따른 클래스 추가
    if (level === "매우 위험") {
        modal.classList.add("modal-danger");
    } else if (level === "위험") {
        modal.classList.add("modal-warning");
    } else if (level === "주의") {
        modal.classList.add("modal-low");
    }

    modal.style.display = "flex"; // 모달 표시
}

function openConfirmAlert() {
    const confirmAlertModal = document.getElementById("confirmAlertModal");
    confirmAlertModal.style.display = "flex"; // 커스텀 confirm alert 모달 표시
}

function closeConfirmAlert() {
    const confirmAlertModal = document.getElementById("confirmAlertModal");
    confirmAlertModal.style.display = "none"; // 커스텀 confirm alert 모달 숨기기

    // 원래 모달 닫기
    closeModal();
}

function closeModal() {
    const modal = document.getElementById("alertModal");
    modal.style.display = "none"; // 원래 모달 숨기기
}
