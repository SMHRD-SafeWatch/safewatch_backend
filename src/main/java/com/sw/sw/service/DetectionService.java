package com.sw.sw.service;

import com.sw.sw.entity.Detection;
import com.sw.sw.entity.Warning;
import com.sw.sw.repository.DetectionRepository;
import com.sw.sw.repository.WarningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

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

    public long getTotalCount() {
        return detectionRepository.count();
    }


    public boolean updateResolvedStatus(Long detectionId) {
        Warning warning = warningRepository.findByDetectionId(detectionId);
        System.out.println("Warning Entity: " + warning);

        if (warning == null) {
            System.out.println("No Warning found for detectionId: " + detectionId); // 로그 확인
            return false;
        }
        System.out.println("Resolved Value Before Update: " + warning.getResolved());

        if ("N".equals(warning.getResolved())) { // 대소문자나 공백이 잘못된 경우 매칭 실패
            warning.setResolved("Y");
            warningRepository.save(warning);
            System.out.println("Resolved Value After Update: " + warning.getResolved());

            return true;
        }

        return false;
    }

}
