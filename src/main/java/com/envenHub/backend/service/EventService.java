package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.response.EventDetailResponse;
import com.envenHub.backend.dto.response.EventListResponse;
import com.envenHub.backend.dto.response.PagedResponse;
import com.envenHub.backend.entity.Event;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.filter.EventSpecification;
import com.envenHub.backend.mapper.EventMapper;
import com.envenHub.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

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
}
