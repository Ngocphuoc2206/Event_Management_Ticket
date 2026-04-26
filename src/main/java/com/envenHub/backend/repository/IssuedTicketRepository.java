package com.envenHub.backend.repository;

import com.envenHub.backend.entity.Event;
import com.envenHub.backend.entity.IssuedTicket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssuedTicketRepository extends JpaRepository<IssuedTicket, String> {
    boolean existsByOrderId(String orderId);
    boolean existsByTicketCode(String ticketCode);

    List<IssuedTicket> findByUserIdOrderByIssuedAtDesc(String userId);

    // Get tickets upcoming
    List<IssuedTicket> findByUserIdAndEvent_StartTimeGreaterThanEqualOrderByIssuedAtDesc(String userId, LocalDateTime now);

    //Get tickets past
    List<IssuedTicket> findByUserIdAndEvent_EndTimeLessThanOrderByIssuedAtDesc(String userId, LocalDateTime now);

    Optional<IssuedTicket> findByIdAndUserId(String id, String userId);
    Optional<IssuedTicket> findByTicketCode(String ticketCode);
    Optional<IssuedTicket> findFirstByOrderItemId(String orderItemId);

    @Query("""
    select t from IssuedTicket t
    join t.user u
    join t.orderItem oi
    join oi.ticketType tt
    where t.event.id = :eventId
      and (:status is null or t.used = :status)
      and (
        :search is null
        or lower(u.fullName) like lower(concat('%', :search, '%'))
        or lower(u.email) like lower(concat('%', :search, '%'))
        or lower(tt.name) like lower(concat('%', :search, '%'))
        or lower(t.ticketCode) like lower(concat('%', :search, '%'))
      )
""")
    Page<IssuedTicket> findAttendeesByEvent(
            @Param("eventId") String eventId,
            @Param("search") String search,
            @Param("status") Boolean status,
            Pageable pageable
    );
    List<IssuedTicket> findByOrderId(String orderId);
}