package com.sw.sw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "WARNING")
public class Warning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warning_id")
    private Long warningId;

    @Column(name = "detection_id", insertable = false, updatable = false)  // 중복 매핑 방지
    private Long detectionId;

    @Column(name = "warning_time")
    private LocalDateTime warningTime;

//    @Column(name = "warning_type")
//    private String warningType;

    private String resolved;

    @OneToOne
    @JoinColumn(name = "detection_id")
    private Detection detection;

}