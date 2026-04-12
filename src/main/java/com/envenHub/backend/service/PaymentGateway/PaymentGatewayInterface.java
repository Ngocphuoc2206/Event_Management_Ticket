package com.envenHub.backend.service.PaymentGateway;

import com.envenHub.backend.dto.request.PaymentGatewayInitRequest;
import com.envenHub.backend.dto.response.PaymentGatewayInitResponse;
import com.envenHub.backend.enums.PaymentMethod;

public interface PaymentGatewayInterface {
    PaymentMethod getSupportedMethod();
    PaymentGatewayInitResponse initPayment(PaymentGatewayInitRequest request);
}
