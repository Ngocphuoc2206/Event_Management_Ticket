package com.envenHub.backend.repository;

import com.envenHub.backend.entity.IssuedTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssuedTicketRepository extends JpaRepository<IssuedTicket, String> {
    boolean existsByOrderId(String orderId);
    boolean existsByTicketCode(String ticketCode);
    List<IssuedTicket> findByUserIdOrderByIssuedAtDesc(String userId);
    List<IssuedTicket> findByOrderId(String orderId);
}