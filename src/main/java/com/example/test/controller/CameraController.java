package com.example.test.controller;

import com.example.test.entity.Camera;
import com.example.test.repository.CameraRepository;
import com.example.test.service.CameraService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CameraController {

    @Autowired
    private CameraRepository cameraRepository;

    @GetMapping("/portget")
    public List<Camera> portGet(){
        return cameraRepository.findAll();
    }
}
