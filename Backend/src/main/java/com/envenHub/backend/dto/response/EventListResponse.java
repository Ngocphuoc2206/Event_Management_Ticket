package com.envenHub.backend.dto.response;

import com.envenHub.backend.enums.EventStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class EventListResponse {
    private String id;
    private String title;
    private String shortDescription;
    private String category;
    private String city;
    private String venueName;
    private String bannerUrl;
    private LocalDateTime startTime;
    private BigDecimal minPrice;
    private Integer availableTickets;
    private EventStatus status;
    private String rejectReason;
}
