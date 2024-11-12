package com.sw.sw.service;

import com.sw.sw.entity.Education;
import com.sw.sw.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

}
