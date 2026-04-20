package com.envenHub.backend.mapper;

import com.envenHub.backend.dto.response.AttendeeResponse;
import com.envenHub.backend.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AttendeesMapper {
    @Mapping(target = "userId", source = "order.user.id")
    @Mapping(target = "fullName", source = "order.user.fullName")
    @Mapping(target = "email", source = "order.user.email")
    @Mapping(target = "ticketTypeName", source = "ticketType.name")
    AttendeeResponse toAttendeeResponse(OrderItem item);

    List<AttendeeResponse> toAttendeesResponseList(List<OrderItem> items);
}
