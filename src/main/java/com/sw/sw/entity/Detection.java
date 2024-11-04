package com.sw.sw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "DETECTION")
public class Detection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detection_id")
    private Long detectionId;

    @Column(name = "camera_id")
    private Long cameraId;

    @Column(name = "detection_time")
    private LocalDateTime detectionTime;

    @Column(name = "detection_object")
    private String detectionObject;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "risk_level")
    private String riskLevel;

    @ManyToOne
    @JoinColumn(name = "camera_id", insertable = false, updatable = false)
    private CameraInstall cameraInstall;

    @OneToOne
    @JoinColumn(name = "detection_id", referencedColumnName = "detection_id", insertable = false, updatable = false)
    private Warning warning;
}

