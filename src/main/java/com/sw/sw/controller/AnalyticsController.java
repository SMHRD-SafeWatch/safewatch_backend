package com.sw.sw.controller;

import com.sw.sw.entity.Education;
import com.sw.sw.service.EducationService;
import com.sw.sw.service.WarningService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final WarningService warningService;
    private final EducationService educationService;

    // 일일 알림 건수
    @GetMapping("/dailyAlerts")
    public Map<String, Integer> getDailyAlerts() {
        return warningService.getDailyAlerts();
    }

    // 주별 알림 건수
    @GetMapping("/weeklyAlerts")
    public Map<String, Map<String, Integer>> getWeeklyAlerts(
            @RequestParam int year,
            @RequestParam int weekOfYear
    ) {
        return warningService.getWeeklyAlerts(year, weekOfYear);
    }

    // 월별 알림 건수
    @GetMapping("/monthlyAlerts")
    public Map<Integer, Map<String, Integer>> getMonthlyAlerts(@RequestParam int year) {
        return warningService.getMonthlyAlerts(year);
    }

    // 교육 일정
    @GetMapping("/educationSchedules")
    public List<Education> getEducationSchedules(@RequestParam(defaultValue = "latest") String sortOption) {
        return educationService.sortEducations(sortOption);
    }
}


