package com.example.test.repository;

import com.example.test.entity.Camera_Install;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Camera_InstallRepository extends JpaRepository<Camera_Install, Long> {
}
