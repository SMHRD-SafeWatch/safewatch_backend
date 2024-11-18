package com.sw.sw.controller;

import com.sw.sw.entity.CameraInstall;
import com.sw.sw.repository.CameraInstallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RestAPIController {

    @Autowired
    private CameraInstallRepository camerainstallRepository;

    @GetMapping("/portget")
    public List<CameraInstall> portGet(){
        return camerainstallRepository.findAll();
    }

}
