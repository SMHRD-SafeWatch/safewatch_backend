function selectMenu(menuId) {

    switch(menuId) {
        case 'monitoring':
            window.location.href = 'monitoring';
            break;
        case 'events':
            window.location.href = 'detectevt';
            break;
        case 'analytics':
            window.location.href = 'analytics';
            break;
        case 'settings':
            window.location.href = 'settings';
            break;
    }

    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        item.classList.remove("active");

        const icon = item.querySelector('.menu-icon2');
        if (icon) {
            if (icon.classList.contains('warning')) {
                icon.src = '../icon/events_warning.svg';
            } else {
                icon.src = '../icon/events.svg';
            }
        }
    });

    // 클릭된 메뉴 항목에 active 클래스 추가
    const selectedMenu = document.querySelector(`[onclick="selectMenu('${menuId}')"]`);
    if (selectedMenu) {
        selectedMenu.classList.add("active");

        const activeIcon = selectedMenu.querySelector('.menu-icon2');
        if (activeIcon) {
            if (activeIcon.classList.contains('warning')) {
                activeIcon.src = '../icon/events_warning_click.svg';
            } else {
                activeIcon.src = '../icon/events_click.svg';
            }
        }
    }
}

// 오늘 날짜 설정
function setTodayDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('ko-KR', options);

    const dateElement = document.querySelector(".main-content header p");
    if (dateElement) {
        dateElement.textContent = formattedDate;
    }
}

// 알림 개수 가져오기 및 메뉴 업데이트
function updateDetectionSize() {
    fetch('/api/warnings/unresolved/count')
        .then(response => response.json())
        .then(detectionSize => {
            const detectionSizeDisplays = document.querySelectorAll(".menu-detection-size");
            detectionSizeDisplays.forEach(display => {
                // 알림 개수를 괄호 안에 표시
                display.textContent = detectionSize > 0 ? `(${detectionSize})` : '';
            });

            const menuIcon2 = document.querySelector('.menu-icon2');
            if (menuIcon2) {
                // Warning 아이콘 상태 업데이트
                if (detectionSize > 0) {
                    menuIcon2.classList.add('warning');
                    if (menuIcon2.closest('.menu-item').classList.contains('active')) {
                        menuIcon2.src = '../icon/events_warning_click.svg';
                    } else {
                        menuIcon2.src = '../icon/events_warning.svg';
                    }
                } else {
                    menuIcon2.classList.remove('warning');
                    if (menuIcon2.closest('.menu-item').classList.contains('active')) {
                        menuIcon2.src = '../icon/events_click.svg';
                    } else {
                        menuIcon2.src = '../icon/events.svg';
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching detection size:', error));
}


document.addEventListener("DOMContentLoaded", () => {
    setTodayDate(); // 오늘 날짜 설정
    updateDetectionSize(); // 알림 개수 업데이트
    setInterval(updateDetectionSize, 5000); // 간격
});
