function showLogoutModal() {
    document.getElementById('logout-modal').style.display = 'flex';
}

function closeLogoutModal() {
    document.getElementById('logout-modal').style.display = 'none';
}

// 로그아웃
document.getElementById('logoutConfirmBtn').addEventListener('click', function () {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                alert('로그아웃에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('로그아웃 요청 중 오류 발생:', error);
        })
        .finally(() => {
            closeLogoutModal();
        });
});

document.getElementById('logoutCancelBtn').addEventListener('click', function () {
    closeLogoutModal();
});

// 볼륨 조절 슬라이더 초기화 및 업데이트
const volumeRange = document.querySelector('.volume-range');

// 초기 설정
function updateSliderBackground(slider) {
    const value = slider.value; // 슬라이더 값
    slider.style.background = `linear-gradient(to right, #00B8D4 ${value}%, #ddd ${value}%)`;
}

// 페이지 로드 시 초기화
updateSliderBackground(volumeRange);

// 슬라이더 변경 시 업데이트
volumeRange.addEventListener('input', function () {
    updateSliderBackground(this);
});
