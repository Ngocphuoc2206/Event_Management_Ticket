package com.envenHub.backend.entity;

import com.envenHub.backend.enums.PaymentMethod;
import com.envenHub.backend.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String provider;
    private String providerTransactionId;

    @Column(length = 1000)
    private String paymentUrl;

    @Column(length = 1000)
    private String clientSecret;

    private LocalDateTime createdAt;
    private LocalDateTime expiredAt;
    private LocalDateTime updatedAt;

    @Column(length = 255)
    private String webhookEventId;

    @Column(length = 2000)
    private String webhookPayload;
}
