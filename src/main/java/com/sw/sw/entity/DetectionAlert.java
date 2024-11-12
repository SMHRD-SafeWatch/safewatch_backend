package com.sw.sw.entity;

import jakarta.persistence.Entity;
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
    private String imageUrl;
    private String cameraId;
    private LocalDateTime detectionTime;
    private String content;
    private String location;

}

