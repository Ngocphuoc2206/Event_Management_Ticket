package com.envenHub.backend.mapper;

import com.envenHub.backend.dto.request.OrderRequest;
import com.envenHub.backend.dto.response.OrderItemResponse;
import com.envenHub.backend.dto.response.OrderResponse;
import com.envenHub.backend.entity.Order;
import com.envenHub.backend.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    Order toOrder(OrderRequest request);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.fullName")
    @Mapping(target = "items", source = "items")
    OrderResponse toOrderResponse(Order order);

    @Mapping(target = "ticketTypeId", source = "ticketType.id")
    @Mapping(target = "ticketTypeName", source = "ticketType.name")
    @Mapping(target = "subTotal", source = "subTotal")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
}
