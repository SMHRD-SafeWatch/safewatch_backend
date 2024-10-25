package com.example.test.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Camera {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "camera_seq")
    @SequenceGenerator(name = "camera_seq", sequenceName = "camera_sequence", allocationSize = 1)
    private Long id;

    private String rtsp;

    private int port;
}
