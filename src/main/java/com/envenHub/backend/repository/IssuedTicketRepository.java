package com.envenHub.backend.repository;

import com.envenHub.backend.entity.IssuedTicket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssuedTicketRepository extends JpaRepository<IssuedTicket, String> {
    boolean existsByOrderId(String orderId);
}