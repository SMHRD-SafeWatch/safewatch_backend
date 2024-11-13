document.addEventListener("DOMContentLoaded", function () {
    // 탭 메뉴 클릭 시 활성화
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // 이미지 클릭 시 모달 열기
    const images = document.querySelectorAll(".video-thumbnail");
    images.forEach(img => {
        img.addEventListener("click", function () {
            openModal(this.src);
        });
    });

    // 모달 외부를 클릭했을 때 닫기
    const modal = document.getElementById("alertModal");
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Events List 버튼 클릭 시 events.html로 이동
    const eventsButton = document.querySelector(".events-button");
    eventsButton.addEventListener("click", function () {
        window.location.href = 'events.html';
    });
});

function openModal(imageSrc) {
    const modal = document.getElementById("alertModal");
    const modalImage = document.getElementById("modalImage");
    modalImage.src = imageSrc; // 클릭한 이미지 소스를 모달에 적용
    modal.style.display = "flex"; // 표시
}

function closeModal() {
    const modal = document.getElementById("alertModal");
    modal.style.display = "none";
}
