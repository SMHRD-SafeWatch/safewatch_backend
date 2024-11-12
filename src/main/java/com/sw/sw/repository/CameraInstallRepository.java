package com.sw.sw.repository;

import com.sw.sw.entity.CameraInstall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CameraInstallRepository extends JpaRepository<CameraInstall, String> {
    CameraInstall findByCameraId(String cameraId);  // cameraId로 CameraInstall을 조회하는 메서드 추가

}


