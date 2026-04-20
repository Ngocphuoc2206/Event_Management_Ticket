package com.envenHub.backend.dto.request;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PaymentGatewayInitRequest {
    private String paymentId;
    private String orderId;
    private BigDecimal amount;
}
