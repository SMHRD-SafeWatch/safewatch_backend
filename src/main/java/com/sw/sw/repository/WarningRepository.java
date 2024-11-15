package com.sw.sw.repository;

import com.sw.sw.entity.Warning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WarningRepository extends JpaRepository<Warning, Integer> {

    @Query("SELECT w FROM Warning w JOIN FETCH w.detection d WHERE w.warningTime BETWEEN :start AND :end")
    List<Warning> findByWarningTimeBetweenWithDetection(LocalDateTime start, LocalDateTime end);

    @Query("SELECT w FROM Warning w WHERE w.detection.detectionId = :detectionId")
    Warning findByDetectionId(@Param("detectionId") Long detectionId);


}