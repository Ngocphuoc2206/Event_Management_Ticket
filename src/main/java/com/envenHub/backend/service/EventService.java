package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.request.CheckInRequest;
import com.envenHub.backend.dto.request.EventRequest;
import com.envenHub.backend.dto.response.*;
import com.envenHub.backend.entity.Event;
import com.envenHub.backend.entity.IssuedTicket;
import com.envenHub.backend.entity.OrderItem;
import com.envenHub.backend.enums.EventStatus;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.filter.AttendeesSpecification;
import com.envenHub.backend.filter.EventSpecification;
import com.envenHub.backend.mapper.AttendeesMapper;
import com.envenHub.backend.mapper.EventMapper;
import com.envenHub.backend.repository.EventRepository;
import com.envenHub.backend.repository.IssuedTicketRepository;
import com.envenHub.backend.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {
    private final EventRepository eventRepository;
    private final OrderItemRepository orderItemRepository;
    private final IssuedTicketRepository issuedTicketRepository;
    private final EventMapper eventMapper;
    private final AttendeesMapper attendeesMapper;

    @Autowired
    private UserService userService;

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("startTime", "title", "minPrice", "createdAt");

    private static final Set<String> ALLOWED_SORT_FIELDS_ATTENDEES =
            Set.of("fullName", "ticketType","check-in");

    public PagedResponse<EventListResponse> getPublicEvents(
            String search,
            String category,
            String city,
            int page,
            int size,
            String sortBy,
            String sortDir
    ){
        log.info(
                "getPublicEvents called: search={}, category={}, city={}, page={}, size={}, sortBy={}, sortDir={}",
                search, category, city, page, size, sortBy, sortDir
        );

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            log.warn("getPublicEvents failed: invalid sort field={}", sortBy);
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
        log.info(
                "getPublicEvents success: returnedItems={}, totalItems={}, totalPages={}",
                items.size(), result.getTotalElements(), result.getTotalPages()
        );

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
        log.info("getPublicEventDetail called: eventId={}", id);
        Event event = eventRepository.findOne(
                Specification.where(EventSpecification.isPublishedAndPublic())
                        .and((root, query, cb) -> cb.equal(root.get("id"), id))
        ).orElseThrow(() -> {
            log.warn("getPublicEventDetail failed: event not found, eventId={}", id);
            return new AppException(ErrorCode.EVENT_NOT_FOUND);
        });

        log.info("getPublicEventDetail success: eventId={}, title={}", event.getId(), event.getTitle());
        return eventMapper.toDetailResponse(event);
    }

    public PagedResponse<EventListResponse> getPendingEvents(int page, int size){
        log.info("getPendingEvents called: page={}, size={}", page, size);

        //Phân trang
        Pageable pageable = PageRequest.of(page, size);
        Page<Event> result = eventRepository.findByStatus(EventStatus.PENDING, pageable);

        List<EventListResponse> items = result.getContent().stream().map(eventMapper::toListResponse).toList();

        log.info(
                "getPendingEvents success: returnedItems={}, totalItems={}, totalPages={}",
                items.size(), result.getTotalElements(), result.getTotalPages()
        );

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

        log.info("createEvent called: organizerId={}, organizerName={}", user.getId(), user.getFullName());

        Event event = eventMapper.toEvent(request);
        event.setStatus(EventStatus.DRAFT);
        event.setOrganizerName(user.getFullName());
        event.setOrganizerId(user.getId());

        Event savedEvent = eventRepository.save(event);
        log.info(
                "createEvent success: eventId={}, organizerId={}, status={}",
                savedEvent.getId(), savedEvent.getOrganizerId(), savedEvent.getStatus()
        );

        return eventMapper.toDetailResponse(savedEvent);
    }

    public EventDetailResponse updateEvent(
            EventRequest request,
            String eventId,
            Authentication authentication
    ) {
        UserResponse user = userService.getCurrentUser(authentication);
        log.info("updateEvent called: eventId={}, organizerId={}", eventId, user.getId());

        Event event = eventRepository.findByIdAndOrganizerId(eventId, user.getId())
                .orElseThrow(() -> {
                    log.warn("updateEvent failed: event not found, eventId={}, organizerId={}", eventId, user.getId());
                    return new AppException(ErrorCode.EVENT_NOT_FOUND);
                });

        // === Updates are only allowed while in PUBLISHED mode. ===
        if (event.getStatus() == EventStatus.PUBLISHED) {
            log.warn(
                    "updateEvent failed: event cannot be updated in PUBLISHED status, eventId={}, organizerId={}",
                    eventId, user.getId()
            );
            throw new AppException(ErrorCode.EVENT_CANNOT_BE_UPDATED);
        }

        Event updatedEvent = eventRepository.save(event);

        log.info(
                "updateEvent success: eventId={}, organizerId={}, status={}",
                updatedEvent.getId(), updatedEvent.getOrganizerId(), updatedEvent.getStatus()
        );
        return eventMapper.toDetailResponse(updatedEvent);
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

        log.info(
                "getOrganizerEvents called: organizerId={}, search={}, status={}, page={}, size={}, sortBy={}, sortDir={}",
                organizerId, search, status, page, size, sortBy, sortDir
        );

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            log.warn("getOrganizerEvents failed: invalid sort field={}, organizerId={}", sortBy, organizerId);
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

        log.info(
                "getOrganizerEvents success: organizerId={}, returnedItems={}, totalItems={}, totalPages={}",
                organizerId, items.size(), result.getTotalElements(), result.getTotalPages()
        );

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

        log.info("getOrganizerEventDetail called: eventId={}, organizerId={}", eventId, user.getId());

        Event event = eventRepository.findByIdAndOrganizerId(eventId, user.getId())
                .orElseThrow(() -> {
                    log.warn("getOrganizerEventDetail failed: event not found, eventId={}, organizerId={}", eventId, user.getId());
                    return new AppException(ErrorCode.EVENT_NOT_FOUND);
                });

        log.info("getOrganizerEventDetail success: eventId={}, organizerId={}", event.getId(), user.getId());

        return eventMapper.toDetailResponse(event);
    }

    public EventDetailResponse submitEvent(String eventId, Authentication authentication) {
        UserResponse user = userService.getCurrentUser(authentication);
        log.info("submitEvent called: eventId={}, organizerId={}", eventId, user.getId());

        Event event = eventRepository.findByIdAndOrganizerId(eventId, user.getId())
                .orElseThrow(() -> {
                    log.warn("submitEvent failed: event not found, eventId={}, organizerId={}", eventId, user.getId());
                    return new AppException(ErrorCode.EVENT_NOT_FOUND);
                });

        if (event.getStatus() != EventStatus.DRAFT) {
            log.warn(
                    "submitEvent failed: invalid event state, eventId={}, currentStatus={}, organizerId={}",
                    eventId, event.getStatus(), user.getId()
            );
            throw new AppException(ErrorCode.INVALID_EVENT_STATE);
        }

        event.setStatus(EventStatus.PENDING);

        eventRepository.save(event);

        log.info("submitEvent success: eventId={}, newStatus={}", eventId, event.getStatus());


        return eventMapper.toDetailResponse(event);
    }

    public void approveEvent(String id){
        log.info("approveEvent called: eventId={}", id);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("approveEvent failed: event not found, eventId={}", id);
                    return new AppException(ErrorCode.EVENT_NOT_FOUND);
                });

        if (event.getStatus() != EventStatus.PENDING){
            log.warn("approveEvent failed: invalid event state, eventId={}, currentStatus={}", id, event.getStatus());
            throw new AppException(ErrorCode.INVALID_EVENT_STATE);
        }

        event.setStatus(EventStatus.APPROVED);
        event.setRejectReason(null);

        eventRepository.save(event);
        log.info("approveEvent success: eventId={}, newStatus={}", id, event.getStatus());

    }

    public void rejectEvent(String id, String reason) {
        log.info("rejectEvent called: eventId={}, reason={}", id, reason);

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("rejectEvent failed: event not found, eventId={}", id);
                    return new AppException(ErrorCode.EVENT_NOT_FOUND);
                });

        if (event.getStatus() != EventStatus.PENDING) {
            log.warn("rejectEvent failed: invalid event state, eventId={}, currentStatus={}", id, event.getStatus());
            throw new AppException(ErrorCode.INVALID_EVENT_STATE);
        }

        event.setStatus(EventStatus.REJECTED);
        event.setRejectReason(reason);
        eventRepository.save(event);
        log.info("rejectEvent success: eventId={}, newStatus={}", id, event.getStatus());

    }

    public PagedResponse<AttendeeResponse> getAttendees(
            String eventId,
            String search,
            Boolean status,
            int page,
            int size,
            String sortBy,
            String sortDir,
            Authentication authentication
    )
    {
        log.info(
                "getAttendees called: eventId={}, search={}, status={}, page={}, size={}, sortBy={}, sortDir={}",
                eventId, search, status, page, size, sortBy, sortDir
        );

        if (!ALLOWED_SORT_FIELDS_ATTENDEES.contains(sortBy)) {
            log.warn("getAttendees failed: invalid sort field={}, eventId={}", sortBy, eventId);
            throw new AppException(ErrorCode.INVALID_SORT_FIELD);
        }

        UserResponse user = userService.getCurrentUser(authentication);
        String organizerId = user.getId();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    log.warn("getAttendees failed: event not found, eventId={}", eventId);
                    return new AppException(ErrorCode.EVENT_NOT_FOUND);
                });

        if(!event.getOrganizerId().equals(organizerId)) {
            log.warn(
                    "getAttendees failed: forbidden access, eventId={}, organizerId={}, eventOrganizerId={}",
                    eventId, organizerId, event.getOrganizerId()
            );
            throw new AppException(ErrorCode.FORBIDDEN_EVENT_ACCESS);
        }

        Pageable pageable = PageRequest.of(page, size);

        Specification<OrderItem> specification = Specification
                .where(AttendeesSpecification.hasEvent(eventId))
                .and(AttendeesSpecification.hasSearch(search))
                .and(AttendeesSpecification.hasStatus(status))
                .and(AttendeesSpecification.sortBy(sortBy, sortDir));

        Page<OrderItem> result = orderItemRepository.findAll(specification, pageable);


        List<AttendeeResponse> attendees = attendeesMapper.toAttendeesResponseList(result.getContent());
        log.info(
                "getAttendees success: eventId={}, returnedItems={}, totalItems={}, totalPages={}",
                eventId, attendees.size(), result.getTotalElements(), result.getTotalPages()
        );

        return PagedResponse.<AttendeeResponse>builder()
                .items(attendees)
                .totalItems(result.getTotalElements())
                .page(result.getNumber())
                .size(result.getSize())
                .totalPages(result.getTotalPages())
                .hasNext(result.hasNext())
                .build();
    }

    @Transactional
    public CheckInResponse checkIn(CheckInRequest request, Authentication authentication) {
        UserResponse user = userService.getCurrentUser(authentication);
        String userId = user.getId();

        String ticketCode = request.getTicketCode();
        log.info("checkIn called: userId={}, ticketCode={}", userId, ticketCode);

        IssuedTicket ticket = issuedTicketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> {
                    log.warn("checkIn failed: invalid ticket code, ticketCode={}", ticketCode);
                    return new AppException(ErrorCode.INVALID_TICKET_CODE);
                });


        if(!ticket.getUser().getId().equals(userId)) {
            log.warn(
                    "checkIn failed: ticket not belong to user, ticketCode={}, requestUserId={}, ticketOwnerId={}",
                    ticketCode, userId, ticket.getUser().getId()
            );
            throw new AppException(ErrorCode.TICKET_NOT_BELONG_TO_USER);
        }

        if (ticket.isUsed()) {
            log.warn("checkIn failed: ticket already used, ticketCode={}", ticketCode);
            throw new AppException(ErrorCode.TICKET_ALREADY_USED);
        }

        ticket.setUsed(true);

        issuedTicketRepository.save(ticket);
        log.info(
                "checkIn success: ticketCode={}, eventId={}, attendeeId={}",
                ticketCode, ticket.getEvent().getId(), ticket.getUser().getId()
        );

        return CheckInResponse.builder()
                .checkInTime(LocalDateTime.now())
                .message("Check in success")
                .ticketCode(ticket.getTicketCode())
                .attendeeName(ticket.getUser().getFullName())
                .ticketTypeName(ticket.getOrderItem().getTicketType().getName())
                .eventName(ticket.getEvent().getTitle())
                .success(true)
                .build();
    }
}
