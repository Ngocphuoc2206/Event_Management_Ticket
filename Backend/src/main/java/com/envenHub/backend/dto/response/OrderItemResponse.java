package com.envenHub.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private String id;

    private String ticketTypeId;
    private String ticketTypeName;

    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subTotal;
}