package com.envenHub.backend.repository;

import com.envenHub.backend.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, String>, JpaSpecificationExecutor<TicketType> {
    Optional<TicketType> findByIdAndEvent_OrganizerId(String ticketId, String userId);
    Optional<TicketType> findByEvent_IdAndEvent_OrganizerId(String eventId, String userId);
}
