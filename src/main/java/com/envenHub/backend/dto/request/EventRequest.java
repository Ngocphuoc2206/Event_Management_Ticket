package com.envenHub.backend.dto.request;

import com.envenHub.backend.enums.EventStatus;
import com.envenHub.backend.enums.EventVisibility;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventRequest {
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

    private EventVisibility visibility;

    private BigDecimal minPrice;
    private Integer totalTickets;

    private Boolean featured;
}
