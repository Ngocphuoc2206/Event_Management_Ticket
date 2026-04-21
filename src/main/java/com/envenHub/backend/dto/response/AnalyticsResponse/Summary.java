package com.envenHub.backend.dto.response.AnalyticsResponse;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class Summary {
    private Long totalTicketsSold;
    private BigDecimal totalRevenue;
    private Double checkInRate;
}
