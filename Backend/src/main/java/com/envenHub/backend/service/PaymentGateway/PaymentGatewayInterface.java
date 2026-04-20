package com.envenHub.backend.service.PaymentGateway;

import com.envenHub.backend.dto.request.PaymentGatewayInitRequest;
import com.envenHub.backend.dto.request.PaymentWebhookRequest;
import com.envenHub.backend.dto.response.PaymentGatewayInitResponse;
import com.envenHub.backend.enums.PaymentMethod;
import com.envenHub.backend.enums.PaymentStatus;

public interface PaymentGatewayInterface {
    PaymentMethod getSupportedMethod();
    PaymentGatewayInitResponse initPayment(PaymentGatewayInitRequest request);
    boolean verifyWebhookSignature(PaymentWebhookRequest request);
    PaymentStatus mapWebhookStatus(PaymentWebhookRequest request);
}
