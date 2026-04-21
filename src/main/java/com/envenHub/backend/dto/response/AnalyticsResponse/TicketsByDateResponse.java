package com.envenHub.backend.dto.response.AnalyticsResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Getter
@NoArgsConstructor
public class TicketsByDateResponse {
    private Date date;
    private Long totalTickets;

    public TicketsByDateResponse(Date date, Long totalTickets) {
        this.date = date;
        this.totalTickets = totalTickets;
    }
}