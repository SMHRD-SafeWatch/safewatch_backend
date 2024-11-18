package com.sw.sw.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StreamController {

    @GetMapping("/stream")
    public String stream(){

        return "stream";
    }

    @GetMapping("/monitoring")
    public String monitoring(){

        return "monitoring";
    }
}
