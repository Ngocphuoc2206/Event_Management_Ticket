package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.request.OrderRequest;
import com.envenHub.backend.dto.response.OrderResponse;
import com.envenHub.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(
            @RequestBody OrderRequest request,
            Authentication authentication
    ) {
        OrderResponse order = orderService.createOrder(request, authentication);
        return ApiResponse.<OrderResponse>builder()
                .results(order)
                .build();
    }
}
