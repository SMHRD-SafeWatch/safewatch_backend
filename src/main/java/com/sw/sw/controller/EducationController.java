package com.sw.sw.controller;

import com.sw.sw.entity.Education;
import com.sw.sw.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;
    private final SpringTemplateEngine templateEngine;

    // 교육 일정 목록
    @GetMapping("/analytics")
    public String educationList(Model model){
        List<Education> educations = educationService.sortEducations("latest");
        model.addAttribute("educations", educations);
        return "analytics";
    }

    // 교육 일정 정렬
    @PostMapping("/analytics")
    @ResponseBody
    public String sortEducation(@RequestParam("eduArray") String sortOption, Model model){
        List<Education> educations = educationService.sortEducations(sortOption);

        Context context = new Context();
        context.setVariable("educations", educations);
        return templateEngine.process("analytics", context);
    }

}

