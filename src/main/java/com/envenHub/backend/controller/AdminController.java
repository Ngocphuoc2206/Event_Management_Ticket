package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<?> admin() {
        return ApiResponse.builder()
                .message("Welcome to Admin")
                .results(true)
                .build();
    }
}
