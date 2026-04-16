package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.request.OrderRequest;
import com.envenHub.backend.dto.response.OrderDetailResponse;
import com.envenHub.backend.dto.response.OrderResponse;
import com.envenHub.backend.dto.response.PagedResponse;
import com.envenHub.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/me")
    public ApiResponse<PagedResponse<OrderResponse>> getAllOrder(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String orderStatus,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Authentication authentication
    ) {
        return ApiResponse.<PagedResponse<OrderResponse>>builder()
                .results(orderService.getAllOrders(page, size, search, orderStatus, sortBy,
                        sortDir, authentication))
                .build();
    }

    @GetMapping("/{id}/me")
    public ApiResponse<OrderDetailResponse> getOrderDetail(
            @PathVariable String id,
            Authentication authentication
    ) {
        return ApiResponse.<OrderDetailResponse>builder()
                .results(orderService.getOrderDetail(id, authentication))
                .build();
    }

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
