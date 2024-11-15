package com.sw.sw.service;

import com.sw.sw.entity.Detection;
import com.sw.sw.entity.DetectionAlert;
import com.sw.sw.repository.DetectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DatabaseChangeService {

    @Autowired
    private DetectionRepository detectionRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // 부트에 들어가 있는 메세징

    private Long lastDetectionId = null; // 마지막 전송된 Detection ID 저장
    private DetectionAlert alert2 = null;


    @Transactional
    @Scheduled(fixedRate = 5000) // 5초마다 실행 예제
    public void checkDatabaseChanges() {
        Detection detectionCg = detectionRepository.findLatest();



        if (detectionCg != null && !detectionCg.getDetectionId().equals(lastDetectionId)) {
            String location = detectionCg.getCameraInstall() != null ? detectionCg.getCameraInstall().getLocation() : "Unknown Location";
            String currentRiskLevel = detectionCg.getRiskLevel();

            if (alert2 != null) {
                int currentRiskPriority = getRiskPriority(currentRiskLevel);
                int alert2RiskPriority = getRiskPriority(alert2.getRiskLevel());

                if (currentRiskPriority < alert2RiskPriority) {
                    // alert2의 위험 수준이 더 높으므로 alert2를 전송
                    messagingTemplate.convertAndSend("/topic/alerts", alert2);
                } else if (currentRiskPriority >= alert2RiskPriority) {
                    // 현재 위험 수준이 더 높거나 같으므로 새로운 alert를 전송하고 alert2 업데이트
                    DetectionAlert alert = new DetectionAlert(
                            detectionCg.getDetectionId(),
                            detectionCg.getImageUrl(),
                            detectionCg.getCameraId(),
                            detectionCg.getDetectionTime(),
                            detectionCg.getContent(),
                            location,
                            currentRiskLevel
                    );
                    messagingTemplate.convertAndSend("/topic/alerts", alert);
                    this.alert2 = alert; // alert2 업데이트
                }
            } else {
                // alert2가 아직 설정되지 않은 경우, 새로 생성된 alert 전송 및 alert2 설정
                DetectionAlert alert = new DetectionAlert(
                        detectionCg.getDetectionId(),
                        detectionCg.getImageUrl(),
                        detectionCg.getCameraId(),
                        detectionCg.getDetectionTime(),
                        detectionCg.getContent(),
                        location,
                        currentRiskLevel
                );
                messagingTemplate.convertAndSend("/topic/alerts", alert);
                this.alert2 = alert;
            }

            lastDetectionId = detectionCg.getDetectionId();
        }
    }

    public void clearAlert(Long detectionId) {
        if (alert2 != null && alert2.getDetectionId().equals(detectionId)) {
            alert2 = null; // alert2를 null로 설정
        }
    }


    // 위험 수준의 우선순위를 반환하는 메소드
    private int getRiskPriority(String riskLevel) {
        switch (riskLevel.toLowerCase()) {
            case "LOW":
                return 1;
            case "MEDIUM":
                return 2;
            case "HIGH":
                return 3;
            default:
                return 0; // 알 수 없는 위험 수준의 경우
        }
    }
}

