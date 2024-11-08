package com.sw.sw.repository;

import com.sw.sw.entity.CameraInstall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CameraInstallRepository extends JpaRepository<CameraInstall, Long> {
}
