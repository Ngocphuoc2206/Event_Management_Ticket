package com.envenHub.backend.repository;

import com.envenHub.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, String>, JpaSpecificationExecutor<Event> {
    Optional<Event> findByIdAndOrganizerId(String eventId, String userId);
}
