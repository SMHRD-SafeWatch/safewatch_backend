package com.sw.sw.controller;

import com.sw.sw.entity.Admin;
import com.sw.sw.service.AdminService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    // 홈 (test용)
    @GetMapping("/home")
    public String home(){

        return "home";
    }

    // 로그인 페이지
    @GetMapping("/login")
    public String showLoginPage(Model model) {
        model.addAttribute("adm", null);
        return "login";
    }

    // 로그인
    @PostMapping("/login")
    public String login(Admin admin, HttpSession session) {
        Admin adm = adminService.login(admin.getAdminId(), admin.getPassword());
        if (adm != null) {
            session.setAttribute("adm", adm);
            return "redirect:/home";
        } else {
            return "login";
        }
    }


}

