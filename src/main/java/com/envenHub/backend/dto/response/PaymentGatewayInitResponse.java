package com.envenHub.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentGatewayInitResponse {
    private String provider;
    private String providerTransactionId;
    private String paymentUrl;
    private String clientSecret;
}
