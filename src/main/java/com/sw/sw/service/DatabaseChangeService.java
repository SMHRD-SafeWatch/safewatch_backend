package com.sw.sw.service;

import com.sw.sw.entity.Detection;
import com.sw.sw.entity.DetectionAlert;
import com.sw.sw.entity.Warning;
import com.sw.sw.repository.DetectionRepository;
import com.sw.sw.repository.WarningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;

@Service
public class DatabaseChangeService {

    @Autowired
    private DetectionRepository detectionRepository;

    @Autowired
    private WarningRepository warningRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    private int detectionSize;
    /**
     * 5초마다 실행하여 RESOLVED = 'N' 데이터를 WebSocket으로 전송
     */
    @Transactional
    @Scheduled(fixedRate = 5000) // 5초마다 실행
    public void checkDatabaseChanges() {
        // Warning 테이블에서 미처리된(RESOLVED = 'N') Detection 가져오기
        List<Detection> detections = detectionRepository.findAllUnresolvedWithDetails();
        System.out.println("총 미처리 알림 갯수: " + detections.size());
        this.detectionSize = detections.size();
        // detections가 비어 있으면 아무 작업도 하지 않음
        if (detections == null || detections.isEmpty()) {
            return;
        }

        // 위험도와 최신순으로 정렬
        detections.sort((d1, d2) -> {
            int riskPriority1 = getRiskPriority(d1.getRiskLevel());
            int riskPriority2 = getRiskPriority(d2.getRiskLevel());
            if (riskPriority1 != riskPriority2) {
                return Integer.compare(riskPriority2, riskPriority1); // 위험도 높은 순
            } else {
                return Long.compare(d2.getDetectionId(), d1.getDetectionId()); // 최신순
            }
        });

        Detection nextDetection = detections.get(0); // 우선순위가 가장 높은 데이터
        System.out.println("정렬된 데이터: " + nextDetection);

        // 조건 없이 항상 WebSocket으로 데이터 전송
        messagingTemplate.convertAndSend("/topic/alerts", createAlert(nextDetection));
        System.out.println("WebSocket으로 전송: " + nextDetection);
    }


    /**
     * 위험도 우선순위 반환
     */
    private int getRiskPriority(String riskLevel) {
        switch (riskLevel.toUpperCase()) {
            case "LOW":
                return 1;
            case "MEDIUM":
                return 2;
            case "HIGH":
                return 3;
            default:
                return 0; // 알 수 없는 위험도
        }
    }

    /**
     * WebSocket 메시지 데이터 생성
     */
    private DetectionAlert createAlert(Detection detection) {
        Warning warning = warningRepository.findByDetectionId(detection.getDetectionId());

        // RESOLVED 상태가 'Y'인 데이터는 전송하지 않음
        if ("Y".equals(warning.getResolved())) {
            System.out.println("이미 처리된 데이터, WebSocket으로 전송하지 않음: " + detection.getDetectionId());
            return null;
        }

        String location = detection.getCameraInstall() != null
                ? detection.getCameraInstall().getLocation()
                : "Unknown Location";

        String imageUrlBase64 = detection.getImageUrl() != null
                ? Base64.getEncoder().encodeToString(detection.getImageUrl())
                : null;


        return new DetectionAlert(
                detection.getDetectionId(),
                imageUrlBase64,
                detection.getCameraId(),
                detection.getDetectionTime(),
                detection.getContent(),
                location,
                detection.getRiskLevel(),
                detectionSize
        );

    }
}
