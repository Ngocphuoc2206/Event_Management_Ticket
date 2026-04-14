package com.envenHub.backend.service.PaymentGateway;

import com.envenHub.backend.entity.Order;
import com.envenHub.backend.enums.PaymentStatus;

import org.springframework.stereotype.Service;

@Service
public class PaymentServiceHelper {

    public PaymentStatus getPaymentStatus(Order order) {
        if (order.getPayments() == null || order.getPayments().isEmpty()) {
            return null;
        }

        if (order.getPayments().stream()
                .anyMatch(p -> p.getPaymentStatus() == PaymentStatus.SUCCESS)) {
            return PaymentStatus.SUCCESS;
        }

        if (order.getPayments().stream()
                .anyMatch(p -> p.getPaymentStatus() == PaymentStatus.PENDING)) {
            return PaymentStatus.PENDING;
        }

        if (order.getPayments().stream()
                .anyMatch(p -> p.getPaymentStatus() == PaymentStatus.FAILED)) {
            return PaymentStatus.FAILED;
        }

        if (order.getPayments().stream()
                .anyMatch(p -> p.getPaymentStatus() == PaymentStatus.EXPIRED)) {
            return PaymentStatus.EXPIRED;
        }

        return PaymentStatus.CANCELLED;
    }
}