package com.sw.sw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "CAMERA_INSTALL")
public class CameraInstall {

    @Id
    @Column(name = "camera_id")
    private String cameraId;

    private String location;

    @Column(name = "latitude")
    private String latitude;

    @Column(name = "longitude")
    private String longitude;

    private String status;

    @Column(name = "admin_id")
    private String adminId;

    @Column(name = "camera_url")
    private String cameraUrl;

    private Integer port;

    @OneToMany(mappedBy = "cameraInstall")
    private List<Detection> detections;

    public CameraInstall(String cameraId) {
        this.cameraId = cameraId;
    }
}