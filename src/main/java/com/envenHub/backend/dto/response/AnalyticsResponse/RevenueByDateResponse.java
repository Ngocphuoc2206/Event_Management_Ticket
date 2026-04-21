package com.envenHub.backend.dto.response.AnalyticsResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Getter
@NoArgsConstructor
public class RevenueByDateResponse {
    private Date date;
    private BigDecimal revenue;

    public RevenueByDateResponse(Date date, BigDecimal revenue) {
        this.date = date;
        this.revenue = revenue;
    }
}