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
