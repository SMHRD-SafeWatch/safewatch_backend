package com.sw.sw.controller;

import com.sw.sw.entity.Education;
import com.sw.sw.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

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

    // 일정 등록
    @PostMapping("/education")
    public ResponseEntity<String> addEducation(@RequestBody Education education) {
        try {
            educationService.addEducation(education);
            return new ResponseEntity<>("Education registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error registering education", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 일정 삭제
    @PostMapping("/deleteEducation")
    public ResponseEntity<Void> deleteEducation(@RequestParam("eduId") int eduId) {
        try {
            educationService.deleteEducationById(eduId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

