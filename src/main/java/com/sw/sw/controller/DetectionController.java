package com.sw.sw.controller;

import com.sw.sw.entity.Detection;
import com.sw.sw.entity.DetectionAsys;
import com.sw.sw.service.DatabaseChangeService;
import com.sw.sw.service.DetectionService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class DetectionController {

    private final DetectionService detectionService;

    private final DatabaseChangeService databaseChangeService;

    @GetMapping("/detectevt")
    public String events_dtn(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "100") int size,Model model) {
        return "events_front";
    }

    @GetMapping("/detections")
    @ResponseBody
    public List<DetectionAsys> getDetections(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "100") int size,Model model) {
        // Detection 엔티티를 DTO로 변환하여 반환
        List<DetectionAsys> detections = detectionService.getAllDetections(page, size);
        return detections;

    }


    @PutMapping("/resolveWarning")
    @ResponseBody
    public ResponseEntity<String> resolveWarning(@RequestParam("detectionId") Long detectionId) {
        boolean updated = detectionService.updateResolvedStatus(detectionId);
        if (updated) {
            return ResponseEntity.ok("Warning resolved successfully.");
        } else {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Warning not found.");
        }
    }



}




