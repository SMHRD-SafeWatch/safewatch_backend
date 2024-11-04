package com.sw.sw.service;

import com.sw.sw.entity.Detection;
import com.sw.sw.repository.DetectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class DetectionService {

    @Autowired
    private DetectionRepository detectionRepository;

    public List<Detection> getDetectionDetails(){

        return detectionRepository.findAll();
    }
}
