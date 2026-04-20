package com.envenHub.backend.mapper;


import com.envenHub.backend.dto.request.EventRequest;
import com.envenHub.backend.dto.response.EventDetailResponse;
import com.envenHub.backend.dto.response.EventListResponse;
import com.envenHub.backend.entity.Event;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface EventMapper {
    EventListResponse toListResponse(Event event);
    EventDetailResponse toDetailResponse(Event event);
    Event toEvent(EventRequest request);

    void updateEvent(@MappingTarget Event event, EventRequest request);
}
