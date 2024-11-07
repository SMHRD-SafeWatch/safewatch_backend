package com.sw.sw.service;

import com.sw.sw.entity.Detection;
import com.sw.sw.repository.DetectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DetectionService {


    @Autowired
    private DetectionRepository detectionRepository;

    private Sort getSort() { // detectionId를 기준으로 오름차순
        return Sort.by(
                Sort.Order.desc("detectionId")
        );
    }
    public List<Detection> getDetectionDetails(){
        Sort sort = getSort();
        List<Detection> detections = detectionRepository.findAll(sort); // 오름차순 함수 적용 및 Repository 가져옴
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd (HH:mm:ss)");// 날짜 시간을 포매팅

        for (Detection detection : detections) {
            if (detection.getDetectionTime() != null) {
                detection.setFormattedDetectionTime(detection.getDetectionTime().format(formatter)); // 포메팅 조건 맞으면 넣기
            }
        }
        return detections;
    }




}
