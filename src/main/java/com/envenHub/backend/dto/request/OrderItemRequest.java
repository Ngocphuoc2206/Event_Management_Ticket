package com.envenHub.backend.dto.request;

import lombok.Data;

@Data
public class OrderItemRequest {
    private String ticketTypeId;
    private Integer quantity;
}
