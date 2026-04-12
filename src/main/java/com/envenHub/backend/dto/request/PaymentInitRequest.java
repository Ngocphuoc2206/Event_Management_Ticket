package com.envenHub.backend.dto.request;

import com.envenHub.backend.enums.PaymentMethod;
import lombok.Data;

@Data
public class PaymentInitRequest {
    private String orderId;
    private PaymentMethod paymentMethod;
}
