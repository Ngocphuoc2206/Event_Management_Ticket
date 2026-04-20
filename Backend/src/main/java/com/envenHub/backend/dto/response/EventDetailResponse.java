package com.envenHub.backend.dto.response;

import com.envenHub.backend.enums.EventStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class EventDetailResponse {
    private String id;
    private String title;
    private String shortDescription;
    private String description;
    private String category;
    private String venueName;
    private String address;
    private String city;
    private String bannerUrl;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String organizerName;
    private BigDecimal minPrice;
    private Integer totalTickets;
    private Integer availableTickets;
    private EventStatus status;
    private String rejectReason;
}
