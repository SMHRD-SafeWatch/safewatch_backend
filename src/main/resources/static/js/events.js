document.addEventListener("DOMContentLoaded", function () {
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