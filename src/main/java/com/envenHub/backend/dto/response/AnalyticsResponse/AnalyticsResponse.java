package com.envenHub.backend.dto.response.AnalyticsResponse;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AnalyticsResponse {
    private Summary summary;
    private Performance performance;
    private List<RevenueByDateResponse> revenueByDate;
    private List<TicketsByDateResponse> ticketsByDate;
}
