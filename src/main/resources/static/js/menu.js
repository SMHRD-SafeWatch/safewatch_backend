function selectMenu(menuId) {
    // 모든 메뉴 항목에서 active 클래스 제거
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => item.classList.remove("active"));

    // 클릭된 메뉴 항목에 active 클래스 추가
    const selectedMenu = document.querySelector(`[onclick="selectMenu('${menuId}')"]`);
    if (selectedMenu) {
        selectedMenu.classList.add("active");
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
document.addEventListener("DOMContentLoaded", setTodayDate);


function selectMenu(menu) {
    if (menu === 'monitoring') {
      window.location.href = '/monitoring'; // 모니터링 페이지의 실제 URL로 변경하세요
    } else if (menu === 'events') {
      window.location.href = '/detectevt'; // 이벤트 페이지의 실제 URL로 변경하세요
    } else if (menu === 'analytics') {
      window.location.href = '/analytics'; // 분석 페이지의 실제 URL로 변경하세요
    }
  }