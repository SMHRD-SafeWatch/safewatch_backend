package com.sw.sw.service;

import com.sw.sw.entity.Education;
import com.sw.sw.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationService {

    private final EducationRepository educationRepository;

    // 교육 일정 목록
    public List<Education> sortEducations(String sortOption) {
        List<Education> educations = educationRepository.findAll();

        if ("latest".equals(sortOption)) {
            educations.sort(Comparator.comparing(Education::getEduDate));
        } else {
            educations.sort(Comparator.comparing(Education::getEduDate).reversed());
        }
        return educations;
    }

    // 일정 등록
    public void addEducation(Education education) {
        educationRepository.save(education);
    }

    // 일정 삭제
    public void deleteEducationById(int eduId) {
        educationRepository.deleteById(eduId);
    }

    // 과거 일정 자동 삭제 (매일 자정 실행)
    @Scheduled(cron = "0 0 0 * * ?")
    public void deletePastEducations() {
        LocalDateTime now = LocalDateTime.now();
        educationRepository.deleteByEduDateBefore(now);
    }

}
