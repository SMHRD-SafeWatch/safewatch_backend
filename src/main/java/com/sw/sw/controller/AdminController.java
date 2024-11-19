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

    // Settings 이동
    @GetMapping("/settings")
    public String settings(Model model) { return "settings"; }

    // warning_front Test용 이동
    @GetMapping("/warning_front")
    public String warning_front(){ return "warning_front"; }

    // monitoring Test용 이동
    @GetMapping("/monitoring")
    public String monitoring(){
        return "monitoring";
    }

    // events Test용 이동
    @GetMapping("/events_front")
    public String events_front(){ return "events_front"; }

    // 로그인 페이지 로딩
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
            return "redirect:/monitoring";
        } else {
            return "login";
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public String logout(HttpSession session){
        session.invalidate();
        return "redirect:/login";
    }
}