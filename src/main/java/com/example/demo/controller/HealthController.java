package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*") // DO NOT do this in production, but we need it for local dev tonight
public class HealthController {
    @GetMapping("/api/ping")
    public String ping() {
        return "Server is awake!";
    }
}
