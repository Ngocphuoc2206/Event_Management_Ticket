package com.envenHub.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckInResponse {
    private boolean success;
    private String message;
    private String ticketCode;
    private String attendeeName;
    private String ticketTypeName;
    private String eventName;
    private LocalDateTime checkInTime;
}
