package com.envenHub.backend.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentWebhookRequest {
    private String paymentId;
    private String orderId;
    private String providerTransactionId;
    private String provider;
    private String status; // SUCCESS / FAILED / CANCELLED
    private BigDecimal amount;
    private String signature;
    private String eventId;
    private String rawData;     // optional

}
