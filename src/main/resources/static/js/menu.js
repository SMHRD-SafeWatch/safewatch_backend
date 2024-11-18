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

// WARNING 상태 확인 및 메뉴 아이콘 업데이트
function checkUnresolvedWarnings() {
    fetch('/api/warnings/unresolved')
        .then(response => response.json())
        .then(hasUnresolved => {
            const menuIcon2 = document.querySelector('.menu-icon2');
            if (menuIcon2) {
                if (hasUnresolved) {
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
        .catch(error => console.error('Error checking warnings:', error));
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

document.addEventListener("DOMContentLoaded", () => {
    setTodayDate(); // 오늘 날짜 설정
    checkUnresolvedWarnings(); // WARNING 상태 확인
});