package com.sw.sw.service;

import com.sw.sw.entity.Detection;
import com.sw.sw.entity.DetectionAsys;
import com.sw.sw.entity.Warning;
import com.sw.sw.repository.DetectionRepository;
import com.sw.sw.repository.WarningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DetectionService {

    @Autowired
    private DetectionRepository detectionRepository;

    @Autowired
    private WarningRepository warningRepository;

    public List<Detection> getDetectionDetails(int page, int size) {
        List<Detection> detections = detectionRepository.findAllWithDetails();
        int start = page * size;
        int end = Math.min((page + 1) * size, detections.size());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd (HH:mm:ss)");

        List<Detection> pagedDetections = start > end ? new ArrayList<>() : detections.subList(start, end);
        for (Detection detection : pagedDetections) {
            if (detection.getDetectionTime() != null) {
                detection.setFormattedDetectionTime(detection.getDetectionTime().format(formatter));
            }
            // 이미지가 null이 아닐 경우 Base64로 인코딩하여 imageUrlBase64에 설정
            if (detection.getImageUrl() != null) {
                String base64Image = Base64.getEncoder().encodeToString(detection.getImageUrl());
                detection.setImageUrlBase64(base64Image);
            }
            System.out.println("Detection ID: " + detection.getDetectionId());
            System.out.println("Resolved: " + (detection.getWarning() != null ? detection.getWarning().getResolved() : "No Warning"));
        }
        return pagedDetections;
    }

    public List<DetectionAsys> getAllDetections(int page, int size) {
        List<Detection> detections = detectionRepository.findAllWithDetails();

        System.out.println("Fetched detections from DB: " + detections);

        if (detections == null || detections.isEmpty()) {
            System.out.println("No detections found in database.");
            return new ArrayList<>();
        }

        int start = page * size;
        int end = Math.min((page + 1) * size, detections.size());
        List<Detection> pagedDetections = start > end ? new ArrayList<>() : detections.subList(start, end);

        // 포맷터 정의
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd (HH:mm:ss)");


        return pagedDetections.stream()
            .map(detection -> {
                // detectionTime을 포맷팅
                if (detection.getDetectionTime() != null) {
                    detection.setFormattedDetectionTime(detection.getDetectionTime().format(formatter));
                }
                // 이미지 URL을 Base64로 변환
                if (detection.getImageUrl() != null) {
                    String base64Image = Base64.getEncoder().encodeToString(detection.getImageUrl());
                    detection.setImageUrlBase64(base64Image);
                }
                // 로그 출력
                System.out.println("Detection ID: " + detection.getDetectionId());
                System.out.println("Resolved: " + (detection.getWarning() != null ? detection.getWarning().getResolved() : "No Warning"));

                // DTO로 변환
                return convertToDTO(detection);
            })
            .collect(Collectors.toList());
    }

    private DetectionAsys convertToDTO(Detection detection) {
        return new DetectionAsys(
                detection.getRiskLevel(),
                detection.getFormattedDetectionTime(),
                detection.getContent(),
                detection.getImageUrlBase64(),
                detection.getCameraInstall() != null ? detection.getCameraInstall().getLocation() : null,
                detection.getCameraInstall() != null ? detection.getCameraInstall().getCameraId() : null,
                detection.getWarning() != null ? detection.getWarning().getResolved() : null
        );
    }



    public long getTotalCount() {
        return detectionRepository.count();
    }


    public boolean updateResolvedStatus(Long detectionId) {
        Warning warning = warningRepository.findByDetectionId(detectionId);
        System.out.println("Warning Entity: " + warning);

        if (warning == null) {
            return false;
        }

        if ("N".equals(warning.getResolved())) {
            warning.setResolved("Y");
            warningRepository.save(warning);

            return true;
        }

        return false;
    }



}
