package com.envenHub.backend.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TicketTypeRequest {
    private String name;
    private BigDecimal price;
    private Integer quantity;

    private LocalDateTime saleStart;
    private LocalDateTime saleEnd;
}
