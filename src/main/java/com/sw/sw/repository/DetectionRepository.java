package com.sw.sw.repository;

import com.sw.sw.entity.Detection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetectionRepository extends JpaRepository<Detection, Long> {

    @Query("SELECT d FROM Detection d " +
            "JOIN FETCH d.cameraInstall c " +
            "LEFT JOIN FETCH d.warning w " +
            "ORDER BY d.detectionId DESC")
    List<Detection> findAllWithDetails();

    @Query("SELECT d FROM Detection d " +
            "JOIN FETCH d.cameraInstall c " +
            "LEFT JOIN FETCH d.warning w " +
            "WHERE (w.resolved = 'N' OR w IS NULL) AND d.riskLevel <> 'LOW' " +
            "ORDER BY d.detectionId DESC")
    List<Detection> findAllUnresolvedWithDetails();
}