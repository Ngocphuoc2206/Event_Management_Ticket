package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.request.RejectEventRequest;
import com.envenHub.backend.dto.request.UpdateStatusRequest;
import com.envenHub.backend.dto.response.EventListResponse;
import com.envenHub.backend.dto.response.PagedResponse;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.service.EventService;
import com.envenHub.backend.service.UserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private static final Logger log = LogManager.getLogger(AdminController.class);
    @Autowired
    private UserService userService;

    @Autowired
    private EventService eventService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ApiResponse<PagedResponse<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<UserResponse> users = userService.getAllUsers(page, size);

        return ApiResponse.<PagedResponse<UserResponse>>builder()
                .results(users)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable String id) {
        UserResponse user = userService.getUserById(id);

        return ApiResponse.<UserResponse>builder()
                .results(user)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/users/{id}/status")
    public ApiResponse<UserResponse> updateUserStatus(
            @PathVariable String id,
            @RequestBody UpdateStatusRequest request
    ) {
        UserResponse user = userService.updateUserStatus(id, request);

        return ApiResponse.<UserResponse>builder()
                .results(user)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/events/pending")
    public ApiResponse<PagedResponse<EventListResponse>> getPendingEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        log.info("Get pending events...");
        return ApiResponse.<PagedResponse<EventListResponse>>builder()
                .results(eventService.getPendingEvents(page, size))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/events/{id}/approve")
    public ApiResponse<Void> approveEvent(@PathVariable String id) {
        eventService.approveEvent(id);

        return ApiResponse.<Void>builder()
                .message("Event approved successfully")
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/events/{id}/reject")
    public ApiResponse<Void> rejectEvent(
            @PathVariable String id,
            @RequestBody RejectEventRequest request
    ) {
        eventService.rejectEvent(id, request.getReason());

        return ApiResponse.<Void>builder()
                .message("Event rejected successfully")
                .build();
    }
}
