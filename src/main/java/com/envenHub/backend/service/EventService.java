package com.envenHub.backend.service;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.request.EventRequest;
import com.envenHub.backend.dto.response.EventDetailResponse;
import com.envenHub.backend.dto.response.EventListResponse;
import com.envenHub.backend.dto.response.PagedResponse;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.entity.Event;
import com.envenHub.backend.enums.EventStatus;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.filter.EventSpecification;
import com.envenHub.backend.mapper.EventMapper;
import com.envenHub.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    @Autowired
    private UserService userService;

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("startTime", "title", "minPrice", "createdAt");

    public PagedResponse<EventListResponse> getPublicEvents(
            String search,
            String category,
            String city,
            int page,
            int size,
            String sortBy,
            String sortDir
    ){
        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new AppException(ErrorCode.INVALID_SORT_FIELD);
        }
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Event> specification = Specification
                .where(EventSpecification.isPublishedAndPublic())
                .and(EventSpecification.hasSearch(search))
                .and(EventSpecification.hasCategory(category))
                .and(EventSpecification.hasCity(city));

        Page<Event> result = eventRepository.findAll(specification, pageable);

        List<EventListResponse> items = result.getContent().stream().map(eventMapper::toListResponse)
                .toList();
        return PagedResponse.<EventListResponse>builder()
                .items(items)
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .hasNext(result.hasNext())
                .build();
    }

    public EventDetailResponse getPublicEventDetail(String id) {
        Event event = eventRepository.findOne(
                Specification.where(EventSpecification.isPublishedAndPublic())
                        .and((root, query, cb) -> cb.equal(root.get("id"), id))
        ).orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        return eventMapper.toDetailResponse(event);
    }

    public EventDetailResponse createEvent(
            EventRequest request,
            Authentication authentication)
    {
        UserResponse user = userService.getCurrentUser(authentication);

        Event event = eventMapper.toEvent(request);
        event.setStatus(EventStatus.DRAFT);
        event.setOrganizerName(user.getFullName());
        event.setOrganizerId(user.getId());

        return eventMapper.toDetailResponse(eventRepository.save(event));
    }

    public EventDetailResponse updateEvent(
            EventRequest request,
            String eventId,
            Authentication authentication
    ) {
        UserResponse user = userService.getCurrentUser(authentication);

        Event event = eventRepository.findByIdAndOrganizerId(eventId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        // === Updates are only allowed while in DRAFTING mode. ===
        if (event.getStatus() != EventStatus.DRAFT) {
            throw new AppException(ErrorCode.EVENT_CANNOT_BE_UPDATED);
        }

        eventMapper.updateEvent(event, request);

        return eventMapper.toDetailResponse(eventRepository.save(event));
    }

    public PagedResponse<EventListResponse> getMyEvents(
            String search,
            String status,
            int page,
            int size,
            String sortBy,
            String sortDir,
            Authentication authentication
    ) {
        UserResponse currentUser = userService.getCurrentUser(authentication);
        String organizerId = currentUser.getId();

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new AppException(ErrorCode.INVALID_SORT_FIELD);
        }

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Event> specification = Specification
                .where(EventSpecification.belongsToOrganizer(organizerId))
                .and(EventSpecification.hasSearch(search))
                .and(EventSpecification.hasStatus(status));

        Page<Event> result = eventRepository.findAll(specification, pageable);

        List<EventListResponse> items = result.getContent().stream()
                .map(eventMapper::toListResponse)
                .toList();

        return PagedResponse.<EventListResponse>builder()
                .items(items)
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .hasNext(result.hasNext())
                .build();
    }

    public EventDetailResponse getMyEventDetail(String eventId, Authentication authentication) {
        UserResponse user = userService.getCurrentUser(authentication);

        Event event = eventRepository.findByIdAndOrganizerId(eventId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        return eventMapper.toDetailResponse(event);
    }

    public EventDetailResponse submitEvent(String eventId, Authentication authentication) {
        UserResponse user = userService.getCurrentUser(authentication);

        Event event = eventRepository.findByIdAndOrganizerId(eventId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        if (event.getStatus() != EventStatus.DRAFT) {
            throw new AppException(ErrorCode.INVALID_EVENT_STATE);
        }

        event.setStatus(EventStatus.PENDING_APPROVAL);

        eventRepository.save(event);

        return eventMapper.toDetailResponse(event);
    }
}
