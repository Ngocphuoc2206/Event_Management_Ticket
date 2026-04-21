package com.envenHub.backend.repository;

import com.envenHub.backend.entity.TicketType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, String>, JpaSpecificationExecutor<TicketType> {
    Optional<TicketType> findByIdAndEvent_OrganizerId(String ticketId, String userId);
    Optional<TicketType> findByEvent_IdAndEvent_OrganizerId(String eventId, String userId);
    // Lock ticket row user is buying
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from TicketType t where t.id = :id")
    Optional<TicketType> findByIdForUpdate(@Param("id") String id);

    @Query("""
        SELECT COUNT(it)
        FROM IssuedTicket it
        WHERE it.event.id = :eventId AND it.used = true
        """)
    Long countCheckedIn(String eventId);

    @Query("""
        SELECT COUNT(it)
        FROM IssuedTicket it
        WHERE it.event.id = :eventId
        """)
    Long countTotalTickets(String eventId);

}
