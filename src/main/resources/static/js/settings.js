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

// 소리 알림 토글 / 볼륨 조절
const toggleSwitch = document.getElementById('sound-toggle');
const volumeRange = document.getElementById('volume-control');

// 초기 설정
function initializeSettings() {

    let soundEnabled = localStorage.getItem('soundEnabled');
    if (soundEnabled === null) {
        soundEnabled = true;
        localStorage.setItem('soundEnabled', soundEnabled);
    } else {
        soundEnabled = soundEnabled === 'true';
    }
    toggleSwitch.checked = soundEnabled;

    const savedVolume = localStorage.getItem('volumeLevel') || 70;
    volumeRange.value = savedVolume;

    updateSliderBackground(volumeRange);
}

// 볼륨 조절 슬라이더 배경 업데이트
function updateSliderBackground(slider) {
    const value = slider.value;
    slider.style.background = `linear-gradient(to right, #00B8D4 ${value}%, #ddd ${value}%)`;
}

// 소리 알림 상태 변경
toggleSwitch.addEventListener('change', function () {
    const isSoundEnabled = this.checked;
    localStorage.setItem('soundEnabled', isSoundEnabled);
});

// 볼륨 조절
volumeRange.addEventListener('input', function () {
    const volumeValue = this.value;
    localStorage.setItem('volumeLevel', volumeValue);

    updateSliderBackground(this);
});

initializeSettings();
