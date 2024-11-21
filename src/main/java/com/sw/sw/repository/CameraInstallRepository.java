package com.sw.sw.repository;

import com.sw.sw.entity.CameraInstall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CameraInstallRepository extends JpaRepository<CameraInstall, String> {

    @Query(value = "SELECT camera_id, location, latitude, longitude, status, admin_id, camera_url, port FROM CAMERA_INSTALL", nativeQuery = true)
    List<Object[]> findAllExcludingDetectionsNative();

    @Query(value = "SELECT c.camera_id, d.detection_id, w.resolved\n" +
            "FROM camera_install c\n" +
            "INNER JOIN detection d ON c.camera_id = d.camera_id\n" +
            "INNER JOIN warning w ON d.detection_id = w.detection_id",
            nativeQuery = true)
    List<Object[]> findWarningResolved();
}
