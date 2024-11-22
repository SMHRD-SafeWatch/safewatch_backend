package com.sw.sw.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetectionAsys {
    private String riskLevel;
    private String formattedDetectionTime;
    private String content;
    private String imageUrlBase64;
    private String location;
    private String cameraId;
    private String resolved;
    private Long detectionId;

}
