package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.request.CheckInRequest;
import com.envenHub.backend.dto.request.EventRequest;
import com.envenHub.backend.dto.request.TicketTypeRequest;
import com.envenHub.backend.dto.response.*;
import com.envenHub.backend.dto.response.AnalyticsResponse.AnalyticsResponse;
import com.envenHub.backend.service.AnalyticsService;
import com.envenHub.backend.service.EventService;
import com.envenHub.backend.service.TicketTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {
    @Autowired
    private EventService eventService;

    @Autowired
    private TicketTypeService ticketTypeService;

    @Autowired
    private AnalyticsService analyticsService;

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

    @GetMapping("/events/{id}/ticket-types")
    public ApiResponse<PagedResponse<TicketTypeResponse>> getTicketTypesByEvent(
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "saleStart") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Authentication authentication
    ) {

        return ApiResponse.<PagedResponse<TicketTypeResponse>>builder()
                .results(ticketTypeService.getTicketTypesByEvent(id, search, status,
                        page, size, sortBy,sortDir, authentication))
                .build();
    }

    @GetMapping("/events/{id}/attendees")
    public ApiResponse<PagedResponse<AttendeeResponse>> getAttendees(
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean status,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Authentication authentication
    ) {
        return ApiResponse.<PagedResponse<AttendeeResponse>>builder()
                .results(eventService.getAttendees(id, search, status, page, size,
                        sortBy, sortDir, authentication))
                .build();
    }

    @GetMapping("/analytics")
    public ApiResponse<AnalyticsResponse> getAnalytics(
            @RequestParam String eventId,
            @RequestParam(defaultValue = "7d") String range,
            Authentication authentication
    ) {
        return ApiResponse.<AnalyticsResponse>builder()
                .results(analyticsService.getAnalytics(eventId, range, authentication))
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

    @PostMapping("/events/{id}/ticket-types")
    public ApiResponse<TicketTypeResponse> createTicket(
            @RequestBody TicketTypeRequest request,
            @PathVariable String id,
            Authentication authentication
            ) {
        TicketTypeResponse ticketType = ticketTypeService.createTicketType(request, id, authentication);

        return ApiResponse.<TicketTypeResponse>builder()
                .results(ticketType)
                .build();
    }

    @PutMapping("/ticket-types/{id}")
    public ApiResponse<TicketTypeResponse> updateTicket(
            @RequestBody TicketTypeRequest request,
            @PathVariable String id,
            Authentication authentication
    ) {
        TicketTypeResponse ticketType = ticketTypeService.updateTicketType(request, id, authentication);

        return ApiResponse.<TicketTypeResponse>builder()
                .results(ticketType)
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

    @DeleteMapping("/ticket-types/{id}")
    public ApiResponse<Void> deleteTicket(@PathVariable String id, Authentication authentication) {
        ticketTypeService.deleteTicketType(id, authentication);

        return ApiResponse.<Void>builder()
                .message("Ticket type delete successfully")
                .build();
    }
}
