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

    // 기간 내 경고 데이터 조회 (필요한 데이터만 반환)
    @Query("SELECT w.warningTime, d.riskLevel FROM Warning w JOIN w.detection d " +
            "WHERE w.warningTime BETWEEN :start AND :end")
    List<Object[]> findWarningTimeAndRiskLevel(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 주별 알림 건수를 그룹화하여 반환
    @Query("SELECT FUNCTION('TO_CHAR', w.warningTime, 'DY') AS dayOfWeek, d.riskLevel, COUNT(*) " +
            "FROM Warning w JOIN w.detection d " +
            "WHERE w.warningTime BETWEEN :start AND :end " +
            "GROUP BY FUNCTION('TO_CHAR', w.warningTime, 'DY'), d.riskLevel")
    List<Object[]> findWeeklyGroupedByDayAndRiskLevel(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 월별 알림 건수를 그룹화하여 반환
    @Query("SELECT EXTRACT(MONTH FROM w.warningTime) AS month, d.riskLevel, COUNT(*) " +
            "FROM Warning w JOIN w.detection d " +
            "WHERE EXTRACT(YEAR FROM w.warningTime) = :year " +
            "GROUP BY EXTRACT(MONTH FROM w.warningTime), d.riskLevel")
    List<Object[]> findMonthlyGroupedByMonthAndRiskLevel(@Param("year") int year);

    @Query("SELECT w FROM Warning w WHERE w.detection.detectionId = :detectionId")
    Warning findByDetectionId(@Param("detectionId") Long detectionId);

    @Query("SELECT COUNT(w) > 0 FROM Warning w WHERE w.resolved = 'N'")
    boolean existsUnresolvedWarnings();

    @Query("SELECT COUNT(w) FROM Warning w WHERE w.resolved = 'N'")
    long countUnresolvedWarnings();

}