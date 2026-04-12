package com.envenHub.backend.dto.response;

import com.envenHub.backend.enums.PaymentMethod;
import com.envenHub.backend.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentInitResponse {
    private String paymentId;
    private String orderId;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private String provider;
    private String providerTransactionId;
    private String paymentUrl;
    private String clientSecret;
    private LocalDateTime createdAt;
    private LocalDateTime expiredAt;
}
