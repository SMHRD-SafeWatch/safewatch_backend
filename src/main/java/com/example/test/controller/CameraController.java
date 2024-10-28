package com.example.test.controller;

import com.example.test.entity.Camera_Install;
import com.example.test.repository.Camera_InstallRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CameraController {

    private Camera_InstallRepository camera_installRepository;

    @GetMapping("/portget")
    public List<Camera_Install> portGet(){
        return camera_installRepository.findAll();
    }
}
