<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Detection Data22222</title>
</head>
<body>
<h1>Detection Data</h1>
<table border="1">
  <thead>
  <tr>
    <th>riskLevel</th>
    <th>Image URL</th>
    <th>detectionTime</th>
    <th>Warning Type</th>
    <th>Location</th>
    <th>Camera ID</th>
  </tr>
  </thead>
  <tbody>
  <%-- details 리스트의 데이터를 반복하여 테이블에 표시 --%>
  <c:forEach var="detection" items="${details}">
    <tr>
      <td><c:out value="${detection.riskLevel}"/></td>
      <td><c:out value="${detection.imageUrl}"/></td>
      <td><c:out value="${detection.formattedDetectionTime}"/></td>
      <td><c:out value="${detection.content}"/></td>
      <td><c:out value="${detection.cameraInstall.location}"/></td>
      <td><c:out value="${detection.cameraInstall.cameraId}"/></td>
    </tr>
  </c:forEach>
  </tbody>
</table>

<!-- 팝업 HTML 구조 -->
<div id="alertPopup" style="display: none; position: fixed; top: 20%; left: 50%; transform: translate(-50%, -20%); background: white; border: 2px solid red; padding: 20px; width: 300px; z-index: 1000; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
  <h2>⚠️ 알림 - 매우 위험</h2>
  <img id="popupImage" src="" alt="Detection Image" width="100%" style="margin-bottom: 10px;">
  <p>카메라 ID: <span id="popupCameraId"></span></p>
  <p>발생 시간: <span id="popupDetectionTime"></span></p>
  <p>상황 설명: <span id="popupContent"></span></p>
  <p>위치: <span id="popupLocation"></span></p>
  <button onclick="closeAlertPopup()" style="margin-top: 10px;">확인</button>
</div>

<!-- WebSocket Script -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.5.1/sockjs.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>

<script type="text/javascript">
    var socket = new SockJS('/ws');
    var stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/alerts', function (message) {
            var alertData = JSON.parse(message.body);
            console.log("새로운 알림 데이터:", alertData);

            // 알림 데이터를 localStorage에 저장
            localStorage.setItem("alertData", JSON.stringify(alertData));

            // events.jsp로 화면 전환
            window.location.href = "/detectevt";

            setTimeout(function() {
                location.reload(true);
            }, 500);
        });
    });

  // 페이지 로드 시 localStorage에서 alertData를 확인하고 팝업 표시
  window.addEventListener("load", function () {
      var storedAlertData = localStorage.getItem("alertData");
      if (storedAlertData) {
          var alertData = JSON.parse(storedAlertData);

          // 알림 데이터를 화면에 표시
          if (alertData.riskLevel === "high" || alertData.riskLevel === "medium") {
              document.getElementById("popupImage").src = alertData.imageUrl;
              document.getElementById("popupCameraId").textContent = alertData.cameraId;
              document.getElementById("popupDetectionTime").textContent = new Date(alertData.detectionTime).toLocaleString();
              document.getElementById("popupContent").textContent = alertData.content;
              document.getElementById("popupLocation").textContent = alertData.location;

              // 팝업 표시
              showAlertPopup();
          }
          // 팝업을 띄운 후 localStorage에서 데이터 제거
          localStorage.removeItem("alertData");
      }
  });

  function showAlertPopup() {
      console.log("showAlertPopup 실행됨");
      document.getElementById("alertPopup").style.display = "block";
  }

  function closeAlertPopup() {
      document.getElementById("alertPopup").style.display = "none";
      console.log("closeAlertPopup 실행됨");
  }
</script>

</body>
</html>
