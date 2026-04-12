package com.envenHub.backend.mapper;

import com.envenHub.backend.dto.request.TicketTypeRequest;
import com.envenHub.backend.dto.response.TicketTypeResponse;
import com.envenHub.backend.entity.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE // ignore null value when update
)
public interface TicketMapper {
    TicketType toTicket(TicketTypeRequest request);
    List<TicketTypeResponse> toTicketTypeResponseList(List<TicketType> ticketTypes);

    @Mapping(target = "eventId", source = "event.id")
    TicketTypeResponse toTicketTypeResponse(TicketType ticketType);

    void updateTicketType(@MappingTarget TicketType ticketType, TicketTypeRequest request);
}
