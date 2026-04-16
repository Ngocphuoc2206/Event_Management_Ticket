package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.request.PaymentInitRequest;
import com.envenHub.backend.dto.request.PaymentWebhookRequest;
import com.envenHub.backend.dto.response.PaymentInitResponse;
import com.envenHub.backend.dto.response.PaymentWebhookResponse;
import com.envenHub.backend.service.PaymentGateway.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @PostMapping("/init")
    public ApiResponse<PaymentInitResponse> initPayment(
            @RequestBody PaymentInitRequest request,
            Authentication authentication
    ){
        return ApiResponse.<PaymentInitResponse>builder()
                .results(paymentService.initPayment(request, authentication))
                .build();
    }

    @PostMapping("/webhook/mock")
    public ApiResponse<PaymentWebhookResponse> mockWebhook(
            @RequestBody PaymentWebhookRequest request
    ) {
        return ApiResponse.<PaymentWebhookResponse>builder()
                .results(paymentService.handleWebhook(request))
                .build();
    }
}
