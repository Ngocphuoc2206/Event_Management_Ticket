package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.response.EventDetailResponse;
import com.envenHub.backend.dto.response.EventListResponse;
import com.envenHub.backend.dto.response.PagedResponse;
import com.envenHub.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @GetMapping
    public ApiResponse<PagedResponse<EventListResponse>> getEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "startTime") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ){
        return ApiResponse.<PagedResponse<EventListResponse>>builder()
                .results(eventService.getPublicEvents(search, category, city, page, size, sortBy, sortDir))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<EventDetailResponse> getEventDetail(@PathVariable String id) {
        return ApiResponse.<EventDetailResponse>builder()
                .results(eventService.getPublicEventDetail(id))
                .build();
    }
}
