package com.sw.sw.service;

import com.sw.sw.entity.Warning;
import com.sw.sw.repository.WarningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WarningService {

    private final WarningRepository warningRepository;

    // 일일 알림 건수
    public Map<String, Integer> getDailyAlerts() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        List<Object[]> results = warningRepository.findWarningTimeAndRiskLevel(startOfDay, endOfDay);

        // 위험 수준별 그룹화
        return results.stream()
                .collect(Collectors.groupingBy(
                        result -> (String) result[1], // 위험 수준
                        Collectors.summingInt(result -> 1) // 건수 합계
                ));
    }

    // 주별 알림 건수
    public Map<String, Map<String, Integer>> getWeeklyAlerts(int year, int weekOfYear) {
        LocalDate startOfWeek = LocalDate.of(year, 1, 4)
                .with(WeekFields.ISO.weekBasedYear(), year)
                .with(WeekFields.ISO.weekOfYear(), weekOfYear)
                .with(DayOfWeek.MONDAY);

        LocalDate endOfWeek = startOfWeek.plusDays(6);

        List<Object[]> results = warningRepository.findWeeklyGroupedByDayAndRiskLevel(
                startOfWeek.atStartOfDay(), endOfWeek.atTime(23, 59, 59)
        );

        // 요일별 위험 수준별 그룹화
        Map<String, Map<String, Integer>> alertsByDayAndRiskLevel = new LinkedHashMap<>();
        results.forEach(row -> {
            String dayOfWeek = (String) row[0]; // 요일
            String riskLevel = (String) row[1]; // 위험 수준
            int count = ((Number) row[2]).intValue(); // 건수

            alertsByDayAndRiskLevel
                    .computeIfAbsent(dayOfWeek, k -> new HashMap<>())
                    .put(riskLevel, count);
        });

        return alertsByDayAndRiskLevel;
    }

    // 월별 알림 건수
    public Map<Integer, Map<String, Integer>> getMonthlyAlerts(int year) {
        List<Object[]> results = warningRepository.findMonthlyGroupedByMonthAndRiskLevel(year);

        // 월별 위험 수준별 그룹화
        Map<Integer, Map<String, Integer>> monthlyAlerts = new LinkedHashMap<>();
        results.forEach(row -> {
            int month = ((Number) row[0]).intValue(); // 월
            String riskLevel = (String) row[1]; // 위험 수준
            int count = ((Number) row[2]).intValue(); // 건수

            monthlyAlerts
                    .computeIfAbsent(month, k -> new HashMap<>())
                    .put(riskLevel, count);
        });

        return monthlyAlerts;
    }

    private String getKoreanDay(DayOfWeek dayOfWeek) {
        switch (dayOfWeek) {
            case MONDAY: return "월";
            case TUESDAY: return "화";
            case WEDNESDAY: return "수";
            case THURSDAY: return "목";
            case FRIDAY: return "금";
            case SATURDAY: return "토";
            case SUNDAY: return "일";
            default: return "";
        }
    }

    // 확인 안 된(Resolved = 'N') 경고 알림 여부 확인
    public boolean hasUnresolvedWarnings() {
        return warningRepository.existsUnresolvedWarnings();
    }

    // 개수 확인
    public long countUnresolvedWarnings() { return warningRepository.countUnresolvedWarnings(); }
}