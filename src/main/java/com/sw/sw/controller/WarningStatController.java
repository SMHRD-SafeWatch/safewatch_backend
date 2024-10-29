package com.sw.sw.controller;

import com.sw.sw.service.WarningStatService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;

@Controller
@RequiredArgsConstructor
public class WarningStatController {

    private final WarningStatService warningStatService;

    // 날짜별 알림건수 가져오기

}