package com.sw.sw.repository;

import com.sw.sw.entity.Warning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WarningRepository extends JpaRepository<Warning, Integer> {

    @Query("SELECT w FROM Warning w JOIN FETCH w.detection d WHERE w.warningTime BETWEEN :start AND :end")
    List<Warning> findByWarningTimeBetweenWithDetection(LocalDateTime start, LocalDateTime end);
}
