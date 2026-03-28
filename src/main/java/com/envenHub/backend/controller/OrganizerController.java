package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/organizer")
public class OrganizerController {

    @GetMapping
    public ApiResponse<?> organizer() {
        return ApiResponse.builder()
                .message("Welcome to Organizer")
                .results(true)
                .build();
    }
}
