package com.sw.sw.controller;

import com.sw.sw.service.FlaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class FlaskController {

    private final FlaskService flaskService;
}
