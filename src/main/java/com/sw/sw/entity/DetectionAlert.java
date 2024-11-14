package com.sw.sw.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
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
    private byte[] imageUrl;
    private String cameraId;
    private LocalDateTime detectionTime;
    private String content;
    private String location;
    private String riskLevel;
}

