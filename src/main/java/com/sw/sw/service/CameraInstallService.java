package com.sw.sw.service;

import com.sw.sw.entity.CameraInstall;
import com.sw.sw.repository.CameraInstallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CameraInstallService {

    @Autowired
    private CameraInstallRepository cameraInstallRepository;

    public CameraInstall saveCameraInstall(CameraInstall cameraInstall) {
        return cameraInstallRepository.save(cameraInstall);
    }

    // cameraId로 CameraInstall을 조회하는 메서드 추가
    public CameraInstall findByCameraId(String cameraId) {
        return cameraInstallRepository.findByCameraId(cameraId);
    }
}
