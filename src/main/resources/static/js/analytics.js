document.addEventListener("DOMContentLoaded", function() {
    let currentYear = new Date().getFullYear();
    let currentWeek = getISOWeekNumber(new Date());

    loadDailyAlerts();
    loadMonthlyAlerts(currentYear);
    loadEducationSchedules(document.getElementById("eduArray").value);
    loadWeeklyAlerts(currentYear, currentWeek);


    // 일일 알림 건수
    function loadDailyAlerts() {
        fetch('/api/analytics/dailyAlerts')
            .then(response => response.json())
            .then(data => {
                const dailyAlertsList = document.getElementById("dailyAlertsList");

                if (dailyAlertsList) {
                    dailyAlertsList.innerHTML = "";
                    for (const [riskLevel, count] of Object.entries(data)) {
                        const listItem = document.createElement("li");
                        listItem.textContent = `${riskLevel}: ${count}건`;
                        dailyAlertsList.appendChild(listItem);
                    }
                }

                // 데이터 변환
                const labels = ['HIGH', 'MEDIUM', 'LOW'];
                const chartData = labels.map(level => data[level] || 0);

                // 색상 설정
                const backgroundColors = [
                    'rgb(255,46,46,1)', // high: 빨강
                    'rgb(255,149,55,1)', // medium: 주황
                    'rgb(255,217,59,1)'  // low: 노랑
                ];
                const borderColors = [
                    'rgb(255,46,46,1)',
                    'rgb(255,149,55,1)',
                    'rgb(255,217,59,1)'
                ];


                if (window.dailyAlertsChart instanceof Chart) {
                    window.dailyAlertsChart.destroy();
                }

                const ctx = document.getElementById('dailyAlertsChart').getContext('2d');
                window.dailyAlertsChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: '알림 건수',
                            data: chartData,
                            backgroundColor: backgroundColors,
                            borderColor: borderColors,
                            borderWidth: 1.2
                        }]
                    },
                    options: {
                        responsive: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    usePointStyle: true,
                                    font: {
                                        size: 10,
                                    },
                                    padding: 15,
                                    generateLabels: function (chart) {
                                        let datasets = chart.data.datasets;
                                        return datasets[0].data.map((value, index) => {
                                            return {
                                                text: `${chart.data.labels[index]} ${value}회`,
                                                fillStyle: datasets[0].backgroundColor[index],
                                                strokeStyle: datasets[0].backgroundColor[index],
                                                hidden: chart.getDatasetMeta(0).data[index].hidden,
                                                index: index,
                                                pointStyle: 'circle'
                                            };
                                        });
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${context.label}: ${context.raw}건`;
                                    }
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error("일일 알림 데이터를 가져오는 중 오류 발생:", error));
    }


    // 주별 이동 버튼 표시 상태
    function updateButtonVisibility() {
        const today = new Date();
        const currentWeekOfYear = getISOWeekNumber(today);
        const currentYear = today.getFullYear();

        const isFutureWeekDisabled = (currentYear === today.getFullYear() && currentWeek >= currentWeekOfYear);

        document.getElementById("prevWeek").classList.toggle("hidden", !(currentWeek > 1 || currentYear < today.getFullYear()));
        document.getElementById("nextWeek").classList.toggle("hidden", isFutureWeekDisabled);
    }


    updateButtonVisibility();

    // 왼쪽 화살표 (이전 주)
    document.getElementById("prevWeek").addEventListener("click", function () {
        currentWeek--;
        if (currentWeek <= 0) {
            currentYear--;
            currentWeek = getISOWeekNumber(new Date(currentYear, 11, 31));
        }
        loadWeeklyAlerts(currentYear, currentWeek);
        updateButtonVisibility();
    });
    // 오른쪽 화살표 (다음 주)
    document.getElementById("nextWeek").addEventListener("click", function () {
        const lastWeekOfYear = getISOWeekNumber(new Date(currentYear, 11, 28));
        currentWeek++;
        if (currentWeek > lastWeekOfYear) {
            currentYear++;
            currentWeek = 1;
        }
        loadWeeklyAlerts(currentYear, currentWeek);
        updateButtonVisibility();
    });

    // 주별 알림 건수
    const ctx = document.getElementById('weeklyAlertChart');
    if (ctx) {
        // 차트 생성 및 주간 알림 로드
        let currentYear = new Date().getFullYear();
        let currentWeek = getISOWeekNumber(new Date());
        loadWeeklyAlerts(currentYear, currentWeek);
    } else {
        console.error("weeklyAlertChart 요소를 찾을 수 없습니다.");
    }
    let weeklyAlertChart;

    function loadWeeklyAlerts(year, weekOfYear) {
        const startOfWeek = getISOStartOfWeek(year, weekOfYear);

        const weeklyAlertDetails = document.getElementById("weeklyAlertDetails");
        weeklyAlertDetails.innerHTML = displayWeekInfo(startOfWeek); // 현재 주차 정보를 표시

        fetch(`/api/analytics/weeklyAlerts?year=${year}&weekOfYear=${weekOfYear}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("네트워크 응답에 문제가 있습니다.");
                }
                return response.json();
            })
            .then(data => {
                const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
                const riskLevels = {'LOW': [], 'MEDIUM': [], 'HIGH': []};
                const totalCountsByRiskLevel = {'LOW': 0, 'MEDIUM': 0, 'HIGH': 0};

                dayLabels.forEach(day => {
                    const countsByRiskLevel = data[day] || {};
                    riskLevels['LOW'].push(countsByRiskLevel['LOW'] || 0);
                    riskLevels['MEDIUM'].push(countsByRiskLevel['MEDIUM'] || 0);
                    riskLevels['HIGH'].push(countsByRiskLevel['HIGH'] || 0);

                    totalCountsByRiskLevel['LOW'] += countsByRiskLevel['LOW'] || 0;
                    totalCountsByRiskLevel['MEDIUM'] += countsByRiskLevel['MEDIUM'] || 0;
                    totalCountsByRiskLevel['HIGH'] += countsByRiskLevel['HIGH'] || 0;
                });

                if (weeklyAlertChart) {
                    // 이미 차트가 초기화된 경우 데이터를 업데이트
                    weeklyAlertChart.data.datasets[0].data = riskLevels['HIGH'];
                    weeklyAlertChart.data.datasets[1].data = riskLevels['MEDIUM'];
                    weeklyAlertChart.data.datasets[2].data = riskLevels['LOW'];
                    weeklyAlertChart.options.plugins.legend.labels.generateLabels = function (chart) {
                        let datasets = chart.data.datasets;
                        return datasets.map((dataset, index) => {
                            const meta = chart.getDatasetMeta(index);
                            return {
                                text: `${dataset.label}: ${totalCountsByRiskLevel[dataset.label]}회`,
                                fillStyle: dataset.backgroundColor,
                                strokeStyle: dataset.backgroundColor,
                                hidden: meta.hidden === null ? false : meta.hidden, // hidden 상태 명확히 설정
                                index: index,
                                pointStyle: 'circle'
                            };
                        });
                    };
                    weeklyAlertChart.update();
                } else {
                    // 차트가 아직 초기화되지 않은 경우 새로 생성
                    const ctx = document.getElementById('weeklyAlertChart').getContext('2d');
                    weeklyAlertChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: dayLabels,
                            datasets: [
                                {
                                    label: 'HIGH',
                                    data: riskLevels['HIGH'],
                                    backgroundColor: '#F44336' // 빨간색 (high)
                                },
                                {
                                    label: 'MEDIUM',
                                    data: riskLevels['MEDIUM'],
                                    backgroundColor: '#FF9800' // 주황색 (medium)
                                },
                                {
                                    label: 'LOW',
                                    data: riskLevels['LOW'],
                                    backgroundColor: '#FFEB3B' // 노란색 (low)
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        usePointStyle: true,
                                        padding: 20,
                                        generateLabels: function (chart) {
                                            let datasets = chart.data.datasets;
                                            return datasets.map((dataset, index) => {
                                                const meta = chart.getDatasetMeta(index);
                                                return {
                                                    text: `${dataset.label}: ${totalCountsByRiskLevel[dataset.label]}회`,
                                                    fillStyle: dataset.backgroundColor,
                                                    strokeStyle: dataset.backgroundColor,
                                                    hidden: meta.hidden === null ? false : meta.hidden, // hidden 상태 명확히 설정
                                                    index: index,
                                                    pointStyle: 'circle'
                                                };
                                            });
                                        }
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            return `${context.dataset.label}: ${context.raw}회`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    stacked: true
                                },
                                y: {
                                    stacked: true,
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 10
                                    }
                                }
                            },
                            layout: {
                                padding: {top: 5, bottom: 3}
                            }
                        }
                    });

                    // 모든 데이터셋의 meta.hidden 상태 초기화
                    weeklyAlertChart.data.datasets.forEach((dataset, index) => {
                        const meta = weeklyAlertChart.getDatasetMeta(index);
                        if (meta.hidden === null) {
                            meta.hidden = false; // null인 경우 false로 설정하여 참조 오류 방지
                        }
                    });
                }
            })
            .catch(error => console.error("주간 알림 데이터를 가져오는 중 오류 발생:", error));
    }


    // 주차 계산
    function getISOWeekNumber(date) {
        const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = target.getUTCDay() || 7;
        target.setUTCDate(target.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 4)); // 해당 연도의 첫째 주 목요일
        return Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
    }

    // 특정 주의 시작 날짜 계산
    function getISOStartOfWeek(year, weekOfYear) {
        const simple = new Date(Date.UTC(year, 0, 4));
        const dayOfWeek = simple.getUTCDay();
        const firstWeekStart = new Date(simple.setUTCDate(simple.getUTCDate() - dayOfWeek + 1));
        return new Date(firstWeekStart.getTime() + (weekOfYear - 1) * 7 * 86400000);
    }

    // 주차 정보 표시
    function getISOWeekOfMonth(date) {

        const thursdayOfCurrentWeek = new Date(date);
        thursdayOfCurrentWeek.setDate(date.getDate() + (4 - ((date.getDay() + 6) % 7)));

        // 목요일 기준으로 월이 달라지면 다음 달의 첫째 주로 간주
        if (thursdayOfCurrentWeek.getMonth() !== date.getMonth()) {
            return 1;
        }

        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOffset = (8 - startOfMonth.getDay()) % 7;
        const firstMonday = new Date(date.getFullYear(), date.getMonth(), 1 + dayOffset);

        // 월 내에서 주차 계산
        const weekOfMonth = Math.ceil(((date - firstMonday) / (7 * 24 * 60 * 60 * 1000)) + 1);
        return weekOfMonth;
    }

    function displayWeekInfo(date) {

        const thursdayOfCurrentWeek = new Date(date);
        thursdayOfCurrentWeek.setDate(date.getDate() + (4 - ((date.getDay() + 6) % 7)));

        // 월 경계 처리: 목요일이 현재 월과 다르면 다음 달로 간주
        const displayMonth = (thursdayOfCurrentWeek.getMonth() !== date.getMonth())
            ? thursdayOfCurrentWeek.getMonth() + 1
            : date.getMonth() + 1;

        const weekOfMonth = getISOWeekOfMonth(date);

        const weekNames = ["첫째", "둘째", "셋째", "넷째", "다섯째"];
        const weekDisplay = weekNames[weekOfMonth - 1] || `${weekOfMonth}번째`;
        return `<h6>${displayMonth}월 ${weekDisplay}주차 알림 건수</h6>`;
    }


    const yearSelect = document.getElementById("yearSelect");
    const currentYearDisplay = document.getElementById("currentYearDisplay");

    initializeYearOptions(yearSelect, currentYear);

    // 연도 선택
    yearSelect.addEventListener("change", function () {
        const selectedYear = parseInt(yearSelect.value, 10);
        currentYearDisplay.textContent = `${selectedYear}년`; // 선택된 연도로 업데이트
        loadMonthlyAlerts(selectedYear);
    });

    function initializeYearOptions(selectElement, startYear) {
        selectElement.innerHTML = "";
        const endYear = startYear;
        const beginYear = startYear - 1;

        for (let year = endYear; year >= beginYear; year--) {
            const option = document.createElement("option");
            option.value = year;
            option.text = `${year}년`;
            if (year === startYear) option.selected = true;
            selectElement.add(option);
        }

        currentYearDisplay.textContent = `${startYear}년`; // 기본 표시 연도 설정
    }


    // 월별 알림건수 - 연도
    let monthlyAlertsChart; // 기존 차트를 저장할 변수

    function loadMonthlyAlerts(year) {
        fetch(`/api/analytics/monthlyAlerts?year=${year}`)
            .then(response => response.json())
            .then(data => {
                const ctx = document.getElementById('monthlyAlertsChart').getContext('2d');
                const highData = [];
                const mediumData = [];
                const lowData = [];

                // 각 월별 데이터 정리 및 기본값 설정
                for (let month = 1; month <= 12; month++) {
                    const monthData = data[month] || {HIGH: 0, MEDIUM: 0, LOW: 0};
                    highData.push(monthData.HIGH || 0);
                    mediumData.push(monthData.MEDIUM || 0);
                    lowData.push(monthData.LOW || 0);
                }

                // 각 위험 수준의 총 건수를 계산
                const totalCountsByRiskLevel = {
                    HIGH: highData.reduce((acc, val) => acc + (val || 0), 0),
                    MEDIUM: mediumData.reduce((acc, val) => acc + (val || 0), 0),
                    LOW: lowData.reduce((acc, val) => acc + (val || 0), 0)
                };

                // 기존 차트를 파괴하고 새로 생성
                if (monthlyAlertsChart) {
                    monthlyAlertsChart.destroy();
                }

                monthlyAlertsChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: Array.from({length: 12}, (_, i) => `${i + 1}월`),
                        datasets: [
                            {label: 'HIGH', data: highData, backgroundColor: '#F44336'},
                            {label: 'MEDIUM', data: mediumData, backgroundColor: '#FF9800'},
                            {label: 'LOW', data: lowData, backgroundColor: '#FFEB3B'}
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    usePointStyle: true,
                                    padding: 20,
                                    generateLabels: function (chart) {
                                        let datasets = chart.data.datasets;
                                        return datasets.map((dataset, index) => {
                                            const meta = chart.getDatasetMeta(index);
                                            return {
                                                text: `${dataset.label}: ${totalCountsByRiskLevel[dataset.label]}회`,
                                                fillStyle: dataset.backgroundColor,
                                                strokeStyle: dataset.backgroundColor,
                                                hidden: meta.hidden === null ? false : meta.hidden,
                                                index: index,
                                                pointStyle: 'circle'
                                            };
                                        });
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${context.dataset.label}: ${context.raw}회`;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {stacked: true},
                            y: {
                                stacked: true,
                                beginAtZero: true,
                                ticks: {stepSize: 10}
                            }
                        },
                        layout: {
                            padding: {top: 10, bottom: 3}
                        }
                    }
                });
            })
            .catch(error => console.error(`Error fetching monthly alerts data for year ${year}:`, error));
    }


    // 일정등록 관련 변수
    const openEduModalButton = document.getElementById("openEduModalButton");
    const closeEduModalButton = document.getElementById("closeEduModalButton");
    const addEduModal = document.getElementById("addEduModal");
    const addEduForm = document.getElementById("addEduForm");
    // 일정등록 폼 모달 열기
    openEduModalButton.addEventListener("click", function() {
        addEduModal.style.display = "flex";
    });

    // 일정등록 폼 모달 닫기
    closeEduModalButton.addEventListener("click", function() {
        addEduModal.style.display = "none";
    });

    // 일정등록 모달 외부 클릭 시 닫기
    window.addEventListener("click", function(event) {
        if (event.target === addEduModal) {
            addEduModal.style.display = "none";
        }
    });

    // 등록 버튼 클릭 이벤트
    const submitEduButton = document.getElementById("submitEduButton");
    submitEduButton.addEventListener("click", function() {
        const eduName = document.getElementById("eduName").value;
        const eduDate = document.getElementById("eduDate").value;
        const eduDuration = parseInt(document.getElementById("eduDuration").value, 10);


        if (eduName && eduDate && eduDuration) {

            const educationData = {
                eduName: eduName,
                eduDate: eduDate,
                eduDuration: eduDuration
            };

            fetch("/education", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(educationData)
            })
                .then(response => {
                    if (response.ok) {
                        document.getElementById("addEduForm").reset();
                        addEduModal.style.display = "none";
                        loadEducationSchedules(document.getElementById("eduArray").value);
                    } else {
                        console.error("교육 일정 등록에 실패했습니다.");
                        alert("교육 일정 등록에 실패했습니다.");
                    }
                })
                .catch(error => {
                    console.error("서버 오류:", error);
                });
        } else {
            alert("모든 필드를 입력해주세요.");
        }
    });



    // 교육 일정 드롭다운 변경 시 로드 함수 호출
    document.getElementById("eduArray").addEventListener("change", function() {
        loadEducationSchedules(this.value);
    });

    // 화면의 다른 부분 클릭 시 드롭다운 닫기
    document.addEventListener("click", function(event) {
        if (activeDropdown && !event.target.closest(".dropdown")) {
            activeDropdown.style.display = "none";
            activeDropdown = null;
        }
    });

    document.getElementById("confirmDeleteBtn").addEventListener("click", deleteItem);
    document.getElementById("cancelDeleteBtn").addEventListener("click", closeDeleteConfirm);


});


// 교육 일정 삭제 Dropdown
let activeDropdown = null;

function toggleDropdown(icon) {
    const dropdownMenu = icon.nextElementSibling;

    if (activeDropdown && activeDropdown !== dropdownMenu) {
        activeDropdown.style.display = "none";
    }

    // 현재 드롭다운 메뉴 열고 닫기
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";

    // 현재 드롭다운 메뉴를 활성 드롭다운으로 저장
    activeDropdown = dropdownMenu.style.display === "block" ? dropdownMenu : null;
}

// 삭제 확인 모달
function showDeleteConfirm(eduId) {
    const deleteConfirmModal = document.getElementById("deleteConfirmModal");
    deleteConfirmModal.style.display = "flex";
    deleteConfirmModal.setAttribute("data-edu-id", eduId);
}

function closeDeleteConfirm() {
    const deleteConfirmModal = document.getElementById("deleteConfirmModal");
    deleteConfirmModal.style.display = "none";
}

// 모달 외부를 클릭하면 모달 닫기
window.addEventListener("click", function(event) {
    const deleteConfirmModal = document.getElementById("deleteConfirmModal");

    // 모달이 열려 있고, 클릭한 대상이 모달 내부가 아닌 경우에만 모달 닫기
    if (deleteConfirmModal.style.display === "flex" && event.target === deleteConfirmModal) {
        closeDeleteConfirm();
    }


});

// 항목 삭제
function deleteItem() {
    const deleteConfirmModal = document.getElementById("deleteConfirmModal");
    const eduId = deleteConfirmModal.getAttribute("data-edu-id");

    fetch(`/deleteEducation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `eduId=${eduId}`,
    })
        .then(response => {
            if (response.ok) {
                alert("교육 일정이 삭제되었습니다.");
                loadEducationSchedules(document.getElementById("eduArray").value);
            } else {
                alert("삭제 중 오류가 발생했습니다.");
            }
        })
        .catch(error => {
            console.error("삭제 요청 실패:", error);
            alert("삭제 요청에 실패했습니다.");
        });

    deleteConfirmModal.style.display = "none";
}

// 교육 일정 로드 함수
function loadEducationSchedules(sortOption) {
    fetch(`/api/analytics/educationSchedules?sortOption=${sortOption}`)
        .then(response => response.json())
        .then(data => {
            const educationList = document.getElementById("educationTb");
            educationList.innerHTML = ""; // 기존 항목 초기화
            data.forEach(education => {
                const card = document.createElement("div");
                card.classList.add("education-card");

                card.innerHTML = `
                    <div class="education-day">
                        <span class="day">${education.day}</span>
                        <span class="weekday">${education.weekday}</span>
                    </div>
                    <div class="education-details">
                        <p class="edu-name">${education.eduName}</p>
                        <p class="edu-time">${education.formattedDate}</p>
                    </div>
                    <div class="dropdown dropright">
                        <img src="icon/delete.svg" alt="delete_icon" class="delete-icon">
                        <div class="dropdown-menu">
                            <button class="dropdown-item">삭제</button>
                        </div>
                    </div>
                `;

                // 드롭다운 아이콘에 클릭 이벤트 리스너 추가
                const deleteIcon = card.querySelector(".delete-icon");
                deleteIcon.addEventListener("click", function(event) {
                    event.stopPropagation(); // 이벤트 버블링 방지
                    toggleDropdown(deleteIcon);
                });

                // 삭제 버튼에 삭제 확인 모달 열기 이벤트 리스너 추가
                const deleteButton = card.querySelector(".dropdown-item");
                deleteButton.addEventListener("click", () => showDeleteConfirm(education.eduId));

                educationList.appendChild(card);
            });
        })
        .catch(error => console.error("교육 일정 데이터를 가져오는 중 오류 발생:", error));
}

