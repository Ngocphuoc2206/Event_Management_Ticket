package com.envenHub.backend.service.PaymentGateway;

import com.envenHub.backend.entity.Order;
import com.envenHub.backend.enums.PaymentStatus;

import org.springframework.stereotype.Service;

@Service
public class PaymentServiceHelper {

    public PaymentStatus getPaymentStatus(Order order) {

        var payments = order.getPayments();

        if (payments == null || payments.isEmpty()) {
            return null;
        }

        // Flag
        boolean hasSuccess = false;
        boolean hasPending = false;
        boolean hasFailed = false;
        boolean hasExpired = false;

        for (var p : payments ) {
            switch (p.getPaymentStatus()) {
                case SUCCESS -> hasSuccess = true;
                case PENDING -> hasPending = true;
                case FAILED -> hasFailed = true;
                case EXPIRED -> hasExpired = true;
                case CANCELLED -> {}
            }
        }

        if (hasSuccess) return PaymentStatus.SUCCESS;
        if (hasPending) return PaymentStatus.PENDING;
        if (hasFailed) return PaymentStatus.FAILED;
        if (hasExpired) return PaymentStatus.EXPIRED;

        return PaymentStatus.CANCELLED;
    }
}