package com.envenHub.backend.dto.response;

import com.envenHub.backend.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private String id;
    private String title;
    private String content;
    private NotificationType type;
    private boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
    private String orderId;
}
