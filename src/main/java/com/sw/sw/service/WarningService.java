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

        List<Warning> warnings = warningRepository.findByWarningTimeBetweenWithDetection(startOfDay, endOfDay);

        return warnings.stream()
                .collect(Collectors.groupingBy(
                        w -> w.getDetection().getRiskLevel(),
                        Collectors.summingInt(w -> 1)
                ));
    }

    // 주별 알림 건수
    public Map<String, Map<String, Integer>> getWeeklyAlerts(int year, int weekOfYear) {
        LocalDate startOfWeek = LocalDate.of(year, 1, 4)
                .with(WeekFields.ISO.weekBasedYear(), year)
                .with(WeekFields.ISO.weekOfYear(), weekOfYear)
                .with(java.time.DayOfWeek.MONDAY);

        LocalDate endOfWeek = startOfWeek.plusDays(6);

        List<Warning> warnings = warningRepository.findByWarningTimeBetweenWithDetection(
                startOfWeek.atStartOfDay(), endOfWeek.atTime(23, 59, 59)
        );

        Map<String, Map<String, Integer>> alertsByDayAndRiskLevel = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate day = startOfWeek.plusDays(i);
            String koreanDay = getKoreanDay(day.getDayOfWeek());

            Map<String, Integer> countsByRiskLevel = warnings.stream()
                    .filter(w -> w.getWarningTime().toLocalDate().equals(day))
                    .collect(Collectors.groupingBy(
                            w -> w.getDetection().getRiskLevel(),
                            Collectors.summingInt(w -> 1)
                    ));

            alertsByDayAndRiskLevel.put(koreanDay, countsByRiskLevel);
        }

        return alertsByDayAndRiskLevel;
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

    // 월별 알림 건수
    public Map<Integer, Map<String, Integer>> getMonthlyAlerts(int year) {
        Map<Integer, Map<String, Integer>> monthlyAlerts = new HashMap<>();

        for (int month = 1; month <= 12; month++) {
            LocalDate startOfMonth = LocalDate.of(year, month, 1);
            LocalDate endOfMonth = startOfMonth.with(TemporalAdjusters.lastDayOfMonth());

            List<Warning> warnings = warningRepository.findByWarningTimeBetweenWithDetection(
                    startOfMonth.atStartOfDay(),
                    endOfMonth.plusDays(1).atStartOfDay()
            );

            Map<String, Integer> typeCounts = warnings.stream()
                    .collect(Collectors.groupingBy(
                            w -> w.getDetection().getRiskLevel(),
                            Collectors.summingInt(w -> 1)
                    ));

            monthlyAlerts.put(month, typeCounts);
        }
        return monthlyAlerts;
    }
}