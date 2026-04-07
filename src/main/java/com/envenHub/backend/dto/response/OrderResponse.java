package com.envenHub.backend.dto.response;

import com.envenHub.backend.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private String id;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private OrderStatus status;


    private String userId;
    private String userName;

    private List<OrderItemResponse> items;
}