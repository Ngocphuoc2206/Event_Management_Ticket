package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.request.TicketTypeRequest;
import com.envenHub.backend.dto.response.PagedResponse;
import com.envenHub.backend.dto.response.TicketTypeResponse;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.entity.Event;
import com.envenHub.backend.entity.TicketType;
import com.envenHub.backend.enums.TicketTypeStatus;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.filter.TicketTypeSpecification;
import com.envenHub.backend.mapper.TicketMapper;
import com.envenHub.backend.repository.EventRepository;
import com.envenHub.backend.repository.TicketTypeRepository;
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
public class TicketTypeService {
    private final TicketTypeRepository ticketTypeRepository;
    private final EventRepository eventRepository;
    private final TicketMapper ticketMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("saleStart","saleEnd", "name", "price");

    @Autowired
    private UserService userService;

    public TicketTypeResponse createTicketType(
            TicketTypeRequest request,
            String eventId,
            Authentication authentication
    ) {

        UserResponse user = userService.getCurrentUser(authentication);

        Event event = eventRepository.findByIdAndOrganizerId(eventId, user.getId())
                        .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        TicketType ticketType = ticketMapper.toTicket(request);
        ticketType.setEvent(event);
        ticketType.setSoldQuantity(0);
        ticketType.setStatus(TicketTypeStatus.ACTIVE);

        ticketTypeRepository.save(ticketType);

        return ticketMapper.toTicketTypeResponse(ticketType);
    }

    public PagedResponse<TicketTypeResponse> getPublicTicketTypesByEvent(
            String eventId,
            int page,
            int size
    ) {
        Sort sort = Sort.by(Sort.Direction.ASC, "saleStart");
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<TicketType> specification = Specification
                .where(TicketTypeSpecification.belongsToEvent(eventId))
                .and(TicketTypeSpecification.hasStatus("ACTIVE"));

        Page<TicketType> result = ticketTypeRepository.findAll(specification, pageable);

        List<TicketTypeResponse> tickets =
                ticketMapper.toTicketTypeResponseList(result.getContent());

        return PagedResponse.<TicketTypeResponse>builder()
                .items(tickets)
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .hasNext(result.hasNext())
                .build();
    }

    public TicketTypeResponse updateTicketType(
            TicketTypeRequest request,
            String ticketId,
            Authentication authentication
    ) {
        UserResponse user = userService.getCurrentUser(authentication);

        TicketType ticketType = ticketTypeRepository.findByIdAndEvent_OrganizerId(ticketId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_TYPE_NOT_FOUND));

        // Validate
        if (request.getQuantity() != null) {
            if (request.getQuantity() < ticketType.getSoldQuantity()) {
                throw new AppException(ErrorCode.INVALID_QUANTITY);
            }
        }

        if (request.getSaleStart() != null && request.getSaleEnd() != null) {
            if (request.getSaleStart().isAfter(request.getSaleEnd())) {
                throw new AppException(ErrorCode.INVALID_TIME_RANGE);
            }
        }

        if (request.getSaleEnd() != null && LocalDateTime.now().isAfter(request.getSaleEnd())) {
            throw new AppException(ErrorCode.CANNOT_UPDATE_EXPIRED_TICKET);
        }

        ticketMapper.updateTicketType(ticketType, request);

        return ticketMapper.toTicketTypeResponse(ticketTypeRepository.save(ticketType));
    }

    public void deleteTicketType(String ticketId, Authentication authentication) {
        UserResponse user = userService.getCurrentUser(authentication);

        TicketType ticketType = ticketTypeRepository.findByIdAndEvent_OrganizerId(ticketId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_TYPE_NOT_FOUND));

        //Validate
        if (ticketType.getStatus() == TicketTypeStatus.ACTIVE) {
            throw new AppException(ErrorCode.CANNOT_DELETE_ACTIVE_TICKET);
        }

        ticketTypeRepository.delete(ticketType);
    }

    public PagedResponse<TicketTypeResponse> getTicketTypesByEvent(
            String eventId,
            String search,
            String status,
            int page,
            int size,
            String sortBy,
            String sortDir,
            Authentication authentication
    ) {

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new AppException(ErrorCode.INVALID_SORT_FIELD);
        }

        UserResponse user = userService.getCurrentUser(authentication);
        String organizerId = user.getId();

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<TicketType> specification = Specification
                .where(TicketTypeSpecification.belongsToEvent(eventId))
                .and(TicketTypeSpecification.belongsToOrganizer(organizerId))
                .and(TicketTypeSpecification.hasSearch(search))
                .and(TicketTypeSpecification.hasStatus(status));

        Page<TicketType> result = ticketTypeRepository.findAll(specification, pageable);

        List<TicketTypeResponse> tickets = ticketMapper.toTicketTypeResponseList(result.getContent());

        return PagedResponse.<TicketTypeResponse>builder()
                .items(tickets)
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .hasNext(result.hasNext())
                .build();
    }
}
