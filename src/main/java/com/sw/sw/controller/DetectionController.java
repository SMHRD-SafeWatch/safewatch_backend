package com.sw.sw.controller;

import com.sw.sw.entity.Detection;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class DetectionController {

    private final DetectionService detectionService;

    private final DatabaseChangeService databaseChangeService;

    @GetMapping("/detectevt")
    public String events_dtn(@RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "100") int size,Model model) {
        // 전체 데이터 로드

        List<Detection> details = detectionService.getDetectionDetails(page, size);
        model.addAttribute("details", details);
        return "events_front";
    }

 /*   @GetMapping("/api/detectionDetails")
    @ResponseBody
    public ResponseEntity<List<Detection>> getDetectionDetails(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "100") int size) {
        List<Detection> details = detectionService.getDetectionDetails(page, size);
        return ResponseEntity.ok(details);
    }*/

    @PutMapping("/resolveWarning")
    @ResponseBody
    public ResponseEntity<String> resolveWarning(@RequestParam("detectionId") Long detectionId) {
        System.out.println("Received detectionId: " + detectionId);
        boolean updated = detectionService.updateResolvedStatus(detectionId);
        if (updated) {
            return ResponseEntity.ok("Warning resolved successfully.");
        } else {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Warning not found.");
        }
    }

}




