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

    @Transactional
    @Scheduled(fixedRate = 5000) // 5초마다 실행 예제
    public void checkDatabaseChanges() {
        Detection detectionCg = detectionRepository.findLatest();


        if (detectionCg != null && !detectionCg.getDetectionId().equals(lastDetectionId)) {
            String location = detectionCg.getCameraInstall() != null ? detectionCg.getCameraInstall().getLocation() : "Unknown Location";
            DetectionAlert alert = new DetectionAlert(
                    detectionCg.getImageUrl(),
                    detectionCg.getCameraId(),
                    detectionCg.getDetectionTime(),
                    detectionCg.getContent(),
                    location,
                    detectionCg.getRiskLevel()
            );

            messagingTemplate.convertAndSend("/topic/alerts", alert);

            lastDetectionId = detectionCg.getDetectionId();
        }
    }

}
