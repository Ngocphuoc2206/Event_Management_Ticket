package com.envenHub.backend.dto.response;

import com.envenHub.backend.enums.TicketTypeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketTypeResponse {
    private String id;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    private Integer soldQuantity;

    private LocalDateTime saleStart;
    private LocalDateTime saleEnd;

    private String eventId;
    private TicketTypeStatus status;
}
