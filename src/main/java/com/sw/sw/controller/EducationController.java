package com.sw.sw.controller;

import com.sw.sw.entity.Education;
import com.sw.sw.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    // 교육 일정
    @GetMapping("/analytics")
    public String educationList(Model model){
        List<Education> educations = educationService.sortEducations("latest");
        model.addAttribute("educations", educations);
        return "analytics";
    }

}

