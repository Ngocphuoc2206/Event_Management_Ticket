package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.request.CheckInRequest;
import com.envenHub.backend.dto.request.EventRequest;
import com.envenHub.backend.dto.response.*;
import com.envenHub.backend.entity.Event;
import com.envenHub.backend.entity.OrderItem;
import com.envenHub.backend.enums.EventStatus;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.filter.AttendeesSpecification;
import com.envenHub.backend.filter.EventSpecification;
import com.envenHub.backend.mapper.AttendeesMapper;
import com.envenHub.backend.mapper.EventMapper;
import com.envenHub.backend.repository.EventRepository;
import com.envenHub.backend.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final OrderItemRepository orderItemRepository;
    private final AttendeesMapper attendeesMapper;

    @Autowired
    private UserService userService;

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("startTime", "title", "minPrice", "createdAt");

    private static final Set<String> ALLOWED_SORT_FIELDS_ATTENDEES =
            Set.of("fullName", "ticketTypeName", "check-in");

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

    public PagedResponse<EventListResponse> getPendingEvents(int page, int size){
        //Phân trang
        Pageable pageable = PageRequest.of(page, size);
        Page<Event> result = eventRepository.findByStatus(EventStatus.PENDING, pageable);

        List<EventListResponse> items = result.getContent().stream().map(eventMapper::toListResponse).toList();

        return PagedResponse.<EventListResponse>builder()
                .items(items)
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .hasNext(result.hasNext())
                .build();
    }

    public EventDetailResponse createEvent(
            EventRequest request,
            Authentication authentication)
    {
        UserResponse user = userService.getCurrentUser(authentication);

        Event event = eventMapper.toEvent(request);
        event.setStatus(EventStatus.PENDING);
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

        // === Updates are only allowed while in PUBLISHED mode. ===
        if (event.getStatus() == EventStatus.PUBLISHED) {
            throw new AppException(ErrorCode.EVENT_CANNOT_BE_UPDATED);
        }

        eventMapper.updateEvent(event, request);

        return eventMapper.toDetailResponse(eventRepository.save(event));
    }

    public PagedResponse<EventListResponse> getOrganizerEvents(
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

    public EventDetailResponse getOrganizerEventDetail(String eventId, Authentication authentication) {
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

        event.setStatus(EventStatus.PENDING);

        eventRepository.save(event);

        return eventMapper.toDetailResponse(event);
    }

    public void approveEvent(String id){
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        if (event.getStatus() != EventStatus.PENDING){
            throw new AppException(ErrorCode.INVALID_EVENT_STATE);
        }

        event.setStatus(EventStatus.APPROVED);
        event.setRejectReason(null);

        eventRepository.save(event);
    }

    public void rejectEvent(String id, String reason) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        if (event.getStatus() != EventStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_EVENT_STATE);
        }

        event.setStatus(EventStatus.REJECTED);
        event.setRejectReason(reason);

        eventRepository.save(event);
    }

    public PagedResponse<AttendeeResponse> getAttendees(
            String eventId,
            String search,
            String status,
            int page,
            int size,
            String sortBy,
            String sortDir,
            Authentication authentication
    )
    {

        if (!ALLOWED_SORT_FIELDS_ATTENDEES.contains(sortBy)) {
            throw new AppException(ErrorCode.INVALID_SORT_FIELD);
        }

        UserResponse user = userService.getCurrentUser(authentication);
        String organizerId = user.getId();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        if(!event.getOrganizerId().equals(organizerId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Pageable pageable = PageRequest.of(page, size);

        Specification<OrderItem> specification = Specification
                .where(AttendeesSpecification.hasEvent(eventId))
                .and(AttendeesSpecification.hasSearch(search))
                .and(AttendeesSpecification.hasStatus(status))
                .and(AttendeesSpecification.sortBy(sortBy, sortDir));

        Page<OrderItem> result = orderItemRepository.findAll(specification, pageable);


        List<AttendeeResponse> attendees = attendeesMapper.toAttendeesResponseList(result.getContent());

        return PagedResponse.<AttendeeResponse>builder()
                .items(attendees)
                .totalItems(result.getTotalElements())
                .page(result.getNumber())
                .size(result.getSize())
                .totalPages(result.getTotalPages())
                .hasNext(result.hasNext())
                .build();
    }

    public CheckInResponse checkIn(CheckInRequest request, Authentication authentication) {
        UserResponse user = userService.getCurrentUser(authentication);

        String organizerId = user.getId();

        OrderItem item = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(()-> new AppException(ErrorCode.ORDER_ITEM_NOT_FOUND));

        // Validation
        if(!item.getTicketType().getEvent().getOrganizerId().equals(organizerId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if(Boolean.TRUE.equals(item.getCheckedIn())) {
            throw new AppException(ErrorCode.TICKET_ALREADY_CHECKED);
        }

        item.setCheckedIn(true);
        item.setCheckedAt(LocalDateTime.now());

        orderItemRepository.save(item);

        return CheckInResponse.builder()
                .orderItemId(item.getId())
                .checkedIn(true)
                .checkedInAt(item.getCheckedAt())
                .fullName(item.getOrder().getUser().getFullName())
                .email(item.getOrder().getUser().getEmail())
                .ticketTypeName(item.getTicketType().getName())
                .build();
    }
}
