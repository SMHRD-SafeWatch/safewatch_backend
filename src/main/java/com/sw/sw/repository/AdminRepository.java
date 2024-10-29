package com.sw.sw.repository;

import com.sw.sw.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

    Admin findByAdminIdAndPassword(String adminId, String password);
}
