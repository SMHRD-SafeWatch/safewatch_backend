package com.sw.sw.controller;

import com.sw.sw.entity.CameraInstall;
import com.sw.sw.entity.Detection;
import com.sw.sw.service.CameraInstallService;
import com.sw.sw.service.DetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
public class SaveDetectionController {

    @Autowired
    private DetectionService detectionService;

    @Autowired
    private CameraInstallService cameraInstallService;

    @PostMapping("/scenario1")
    public ResponseEntity<String> saveDetection(@RequestBody Map<String, Object> payload) {
        try {
            String cameraId = (String) payload.get("camera_id");
            String detectionTimeStr = (String) payload.get("detection_time");
            Map<String, Boolean> detectionObject = (Map<String, Boolean>) payload.get("detection_object");
            String imageUrl = (String) payload.get("image_url");
            String riskLevel = (String) payload.get("risk_level");
            String details = (String) payload.get("details");

            // CameraInstall 중복 확인 후 저장
            CameraInstall cameraInstall = cameraInstallService.findByCameraId(cameraId);
            if (cameraInstall == null) {
                cameraInstall = new CameraInstall(cameraId);
                cameraInstallService.saveCameraInstall(cameraInstall);
            }

            // Detection 객체 생성 및 데이터 설정
            Detection detection = new Detection();
            detection.setCameraId(cameraId);
            detection.setDetectionTime(LocalDateTime.parse(detectionTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            detection.setImageUrl(imageUrl);
            detection.setRiskLevel(riskLevel);

            // helmet 및 vest의 상태에 따른 detectionObject 설정
            StringBuilder detectionObjectBuilder = new StringBuilder();
            if (detectionObject.get("helmet") != null && !detectionObject.get("helmet")) {
                detectionObjectBuilder.append("helmet");
            }
            if (detectionObject.get("vest") != null && !detectionObject.get("vest")) {
                if (detectionObjectBuilder.length() > 0) {
                    detectionObjectBuilder.append(",");
                }
                detectionObjectBuilder.append("vest");
            }

            // 최종적으로 false인 값들만 detectionObject에 설정, 아무것도 없으면 빈 문자열로 설정
            detection.setDetectionObject(detectionObjectBuilder.toString());
            detection.setContent(details);

            // Detection 저장
            detectionService.saveDetection(detection);

            return ResponseEntity.ok("Data saved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save data");
        }
    }
}
