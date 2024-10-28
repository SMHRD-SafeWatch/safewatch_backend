package com.sw.sw.service;

import com.sw.sw.entity.Education;
import com.sw.sw.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationService {

    @Autowired
    private final EducationRepository educationRepository;

    // 교육 일정 목록 가져오기
    public List<Education> findAll(){
        return educationRepository.findAll();
    }

    // 교육 일정 정렬
    public List<Education> sortEducations(String sortOption){
        List<Education> educations = findAll();

        if("latest".equals(sortOption)){
            educations.sort(Comparator.comparing(Education::getEduDate).reversed()); // 최신순
        } else {
            educations.sort(Comparator.comparing(Education::getEduDate)); // 오래된 순
        }
        return educations;
    }

}
