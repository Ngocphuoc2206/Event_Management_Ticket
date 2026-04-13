package com.envenHub.backend.service.PaymentGateway;

import com.envenHub.backend.dto.request.PaymentGatewayInitRequest;
import com.envenHub.backend.dto.request.PaymentWebhookRequest;
import com.envenHub.backend.dto.response.PaymentGatewayInitResponse;
import com.envenHub.backend.dto.response.PaymentInitResponse;
import com.envenHub.backend.enums.PaymentMethod;
import com.envenHub.backend.enums.PaymentStatus;
import com.envenHub.backend.util.HmacUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MockPaymentGatewayService implements PaymentGatewayInterface {
    @Override
    public PaymentMethod getSupportedMethod() {
        return PaymentMethod.MOCK;
    }

    @Value("${payment.mock.webhook-secret}")
    private String webhookSecret;

    @Override
    public PaymentGatewayInitResponse initPayment(PaymentGatewayInitRequest request) {
        return PaymentGatewayInitResponse.builder()
                .provider("MOCK_GATEWAY")
                .providerTransactionId("mock-txn-" + request.getPaymentId())
                .paymentUrl("https://mock-pay.local/checkout?paymentId=" + request.getPaymentId())
                .clientSecret("mock-secret-" + request.getPaymentId())
                .build();
    }

    @Override
    public boolean verifyWebhookSignature(PaymentWebhookRequest request) {
        String data = request.getPaymentId()
                + "|" + request.getOrderId()
                + "|" + request.getStatus()
                + "|" + request.getAmount();

        // Create signature
        String expected = HmacUtil.hmacSha256(data, webhookSecret);
//        return expected.equals(request.getSignature());
        return true;
    }


    @Override
    public PaymentStatus mapWebhookStatus(PaymentWebhookRequest request) {
        return switch (request.getStatus().toUpperCase()) {
            case "SUCCESS", "PAID" -> PaymentStatus.SUCCESS;
            case "CANCELLED" -> PaymentStatus.CANCELLED;
            case "EXPIRED" -> PaymentStatus.EXPIRED;
            default -> PaymentStatus.FAILED;
        };
    }
}
