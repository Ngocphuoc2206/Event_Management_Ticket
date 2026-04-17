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
    private String orderItemId;
    private Boolean checkedIn;
    private LocalDateTime checkedInAt;
    private String fullName;
    private String email;
    private String ticketTypeName;
}
