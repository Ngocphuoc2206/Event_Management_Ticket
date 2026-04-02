package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.response.EventDetailResponse;
import com.envenHub.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ApiResponse<?> organizer() {
        return ApiResponse.builder()
                .message("Welcome to Organizer")
                .results(true)
                .build();
    }

    @GetMapping("/events/{id}")
    public ApiResponse<EventDetailResponse> getOrganizerEventDetail(@PathVariable String id) {
        return ApiResponse.<EventDetailResponse>builder()
                .results(eventService.getPublicEventDetail(id))
                .build();
    }
}
