package com.envenHub.backend.repository;

import com.envenHub.backend.entity.Payment;
import com.envenHub.backend.enums.PaymentStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    //Check payment have ordered
    Optional<Payment> findFirstByOrderIdAndPaymentStatusOrderByCreatedAtDesc(String orderId, PaymentStatus status);
    Optional<Payment> findByProviderTransactionId(String providerTransactionId);
    Optional<Payment> findByIdAndOrderId(String paymentId, String orderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Payment p where p.id = :paymentId")
    Optional<Payment> findByIdForUpdate(@Param("paymentId") String paymentId);
}
