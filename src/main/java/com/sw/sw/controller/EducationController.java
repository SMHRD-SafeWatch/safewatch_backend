package com.sw.sw.controller;

import com.sw.sw.entity.Education;
import com.sw.sw.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    // 교육 일정 목록
    @GetMapping("/education")
    public String findAll(Model model){
        List<Education> educations = educationService.findAll();
        model.addAttribute("educations", educations);
        return "education";
    }

    // 교육 일정 정렬
    @PostMapping("/eduSort")
    public String sortEducation(@RequestParam("eduArray") String sortOption, Model model){
        List<Education> educations = educationService.sortEducations(sortOption);
        model.addAttribute("educations", educations);
        return "education";
    }

}

