package com.sw.sw.controller;

import com.sw.sw.entity.CameraInstall;
import com.sw.sw.repository.CameraInstallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RestAPIController {

    @Autowired
    private CameraInstallRepository camerainstallRepository;

    @GetMapping("/portget")
    public List<Map<String, Object>> portGet() {
        List<Object[]> results = camerainstallRepository.findAllExcludingDetectionsNative();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("cameraId", row[0]);
            map.put("location", row[1]);
            map.put("latitude", row[2]);
            map.put("longitude", row[3]);
            map.put("status", row[4]);
            map.put("adminId", row[5]);
            map.put("cameraUrl", row[6]);
            map.put("port", row[7]);
            response.add(map);
        }

        return response;
    }

    @GetMapping("/resolved")
    public List<Map<String, Object>> resolvedGet(){
        List<Object[]> results = camerainstallRepository.findWarningResolved();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("cameraId", row[0]);
            map.put("detectionId", row[1]);
            map.put("resolved", row[2]);
            response.add(map);
        }

        return response;
    }

}
