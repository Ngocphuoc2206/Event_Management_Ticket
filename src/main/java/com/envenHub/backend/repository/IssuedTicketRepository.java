package com.envenHub.backend.repository;

import com.envenHub.backend.entity.IssuedTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IssuedTicketRepository extends JpaRepository<IssuedTicket, String> {
    boolean existsByOrderId(String orderId);
    boolean existsByTicketCode(String ticketCode);

    List<IssuedTicket> findByUserIdOrderByIssuedAtDesc(String userId);

    // Get tickets upcoming
    List<IssuedTicket> findByUserIdAndEvent_StartTimeGreaterThanEqualOrderByIssuedAtDesc(String userId, LocalDateTime now);

    //Get tickets past
    List<IssuedTicket> findByUserIdAndEvent_EndTimeLessThanOrderByIssuedAtDesc(String userId, LocalDateTime now);

    Optional<IssuedTicket> findByIdAndUserId(String id, String userId);

    List<IssuedTicket> findByOrderId(String orderId);
}