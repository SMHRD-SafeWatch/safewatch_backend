package com.example.test.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Camera_Install {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long camera_id;

    private String location;
    private String latitude;
    private String longitude;
    private String status;
    private String admin_id;
    private String camera_url;
    private int port;
}
