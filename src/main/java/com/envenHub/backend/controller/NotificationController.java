package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.response.NotificationResponse;
import com.envenHub.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/me/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<NotificationResponse>> getMyNotifications(Authentication authentication){
        return ApiResponse.<List<NotificationResponse>>builder()
                .results(notificationService.getMyNotifications(authentication))
                .build();
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<NotificationResponse> markNotificationAsRead(
            @PathVariable String id,
            Authentication authentication
    ) {
        return ApiResponse.<NotificationResponse>builder()
                .results(notificationService.markAsRead(id, authentication))
                .build();
    }
}
