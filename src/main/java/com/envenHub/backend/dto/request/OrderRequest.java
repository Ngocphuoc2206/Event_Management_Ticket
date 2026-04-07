package com.envenHub.backend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private List<OrderItemRequest> items;
}
