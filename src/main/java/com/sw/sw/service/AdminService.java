package com.sw.sw.service;

import com.sw.sw.entity.Admin;
import com.sw.sw.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private AdminRepository adminRepository;

    public Admin login(String adminId, String password){
        return adminRepository.findByAdminIdAndPassword(adminId, password);
    }

}