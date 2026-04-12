package com.envenHub.backend.repository;

import com.envenHub.backend.entity.Payment;
import com.envenHub.backend.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    //Check payment have ordered
    Optional<Payment> findFirstByOrderIdAndPaymentStatusOrderByCreatedAtDesc(String orderId, PaymentStatus status);
}
