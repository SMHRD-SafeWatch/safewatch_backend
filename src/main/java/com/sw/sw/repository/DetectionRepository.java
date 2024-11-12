package com.sw.sw.repository;

import com.sw.sw.entity.Detection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetectionRepository extends JpaRepository<Detection, Long> {

    List<Detection> findAll();

    @Query("SELECT d FROM Detection d WHERE d.detectionId = (SELECT MAX(d2.detectionId) FROM Detection d2)")
    Detection findLatest();
}