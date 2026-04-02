package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.request.EventRequest;
import com.envenHub.backend.dto.response.EventDetailResponse;
import com.envenHub.backend.dto.response.EventListResponse;
import com.envenHub.backend.dto.response.PagedResponse;
import com.envenHub.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {
    @Autowired
    private EventService eventService;

    @GetMapping("/events")
    public ApiResponse<PagedResponse<EventListResponse>> getOrganizerEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "startTime") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Authentication authentication
    ) {
        return ApiResponse.<PagedResponse<EventListResponse>>builder()
                .results(eventService.getOrganizerEvents(search, status, page, size, sortBy, sortDir, authentication))
                .build();
    }

    @GetMapping("/events/{id}")
    public ApiResponse<EventDetailResponse> getOrganizerEventDetail(
            @PathVariable String id,
            Authentication authentication
    ) {
        return ApiResponse.<EventDetailResponse>builder()
                .results(eventService.getOrganizerEventDetail(id, authentication))
                .build();
    }

    @PostMapping("/events")
    public ApiResponse<EventDetailResponse> createOrganizerEvent(
            @RequestBody EventRequest request,
            Authentication authentication
    ) {
        EventDetailResponse event = eventService.createEvent(request, authentication);

        return ApiResponse.<EventDetailResponse>builder()
                .results(event)
                .build();
    }

    @PutMapping("/events/{id}")
    public ApiResponse<EventDetailResponse> updateOrganizerEvent(
            @PathVariable String id,
            @RequestBody EventRequest request,
            Authentication authentication
    ) {
        EventDetailResponse event = eventService.updateEvent(request, id, authentication);

        return ApiResponse.<EventDetailResponse>builder()
                .results(event)
                .build();
    }

    @PutMapping("/events/{id}/submit")
    public ApiResponse<EventDetailResponse> submitOrganizerEvent(
            @PathVariable String id,
            Authentication authentication
    ) {
        EventDetailResponse event = eventService.submitEvent(id, authentication);

        return ApiResponse.<EventDetailResponse>builder()
                .results(event)
                .build();
    }
}
