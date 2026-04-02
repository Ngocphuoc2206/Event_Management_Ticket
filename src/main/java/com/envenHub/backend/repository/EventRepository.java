package com.envenHub.backend.repository;

import com.envenHub.backend.entity.Event;
import com.envenHub.backend.enums.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, String>, JpaSpecificationExecutor<Event> {
    Optional<Event> findByIdAndOrganizerId(String eventId, String userId);
    Page<Event> findByStatus(EventStatus status, Pageable pageable);
}
