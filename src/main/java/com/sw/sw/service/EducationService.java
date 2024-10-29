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

    private final EducationRepository educationRepository;


    // 교육 일정 목록 가져오기
    public List<Education> educationList(){
        return educationRepository.findAll();
    }

    // 교육 일정 정렬
    public List<Education> sortEducations(String sortOption){
        List<Education> educations = educationList();

        if("latest".equals(sortOption)){
            educations.sort(Comparator.comparing(Education::getEduDate)); // 최근 순
        } else {
            educations.sort(Comparator.comparing(Education::getEduDate).reversed()); // 먼 미래 순
        }
        return educations;
    }

}
