package com.example.test.service;

import com.example.test.entity.Camera;
import com.example.test.repository.CameraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CameraService {
    private final CameraRepository cameraRepository;

    public List<Camera> findAll(){
        return cameraRepository.findAll();
    }
}
