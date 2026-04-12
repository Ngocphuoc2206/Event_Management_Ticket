package com.envenHub.backend.service.PaymentGateway;

import com.envenHub.backend.dto.request.PaymentGatewayInitRequest;
import com.envenHub.backend.dto.response.PaymentGatewayInitResponse;
import com.envenHub.backend.dto.response.PaymentInitResponse;
import com.envenHub.backend.enums.PaymentMethod;
import org.springframework.stereotype.Service;

@Service
public class MockPaymentGatewayService implements PaymentGatewayInterface {
    @Override
    public PaymentMethod getSupportedMethod() {
        return PaymentMethod.MOCK;
    }

    @Override
    public PaymentGatewayInitResponse initPayment(PaymentGatewayInitRequest request) {
        return PaymentGatewayInitResponse.builder()
                .provider("MOCK_GATEWAY")
                .providerTransactionId("mock-txn-" + request.getPaymentId())
                .paymentUrl("https://mock-pay.local/checkout?paymentId=" + request.getPaymentId())
                .clientSecret("mock-secret-" + request.getPaymentId())
                .build();
    }
}
