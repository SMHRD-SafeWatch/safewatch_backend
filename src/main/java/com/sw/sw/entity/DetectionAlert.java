package com.sw.sw.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetectionAlert {
    private Long detectionId;
    private String imageUrl; // Base64로 인코딩된 이미지 URL
    private String cameraId;
    private LocalDateTime detectionTime;
    private String content;
    private String location;
    private String riskLevel;
}

