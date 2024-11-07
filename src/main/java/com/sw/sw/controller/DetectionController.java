package com.sw.sw.controller;

import com.sw.sw.entity.Detection;
import com.sw.sw.service.DetectionService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class DetectionController {


    private final DetectionService detectionService;

    @GetMapping("/detectevt")
    public String events_dtn(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "10") int size,
                             Model model){ // Detection에서 risk_level, image_url, detection_time을 가져온다

        List<Detection> details = detectionService.getDetectionDetails();

        model.addAttribute("details", details);


        return "events";
    }



}
