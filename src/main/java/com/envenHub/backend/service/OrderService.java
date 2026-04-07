package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.request.OrderItemRequest;
import com.envenHub.backend.dto.request.OrderRequest;
import com.envenHub.backend.dto.response.OrderResponse;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.entity.Order;
import com.envenHub.backend.entity.OrderItem;
import com.envenHub.backend.entity.TicketType;
import com.envenHub.backend.entity.User;
import com.envenHub.backend.enums.OrderStatus;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.mapper.OrderMapper;
import com.envenHub.backend.repository.OrderRepository;
import com.envenHub.backend.repository.TicketTypeRepository;
import com.envenHub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    @Autowired
    private UserService userService;
//    private final
    public OrderResponse createOrder(OrderRequest request, Authentication authentication) {
        LocalDateTime now = LocalDateTime.now();

        User user = userRepository.findById(authentication.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            TicketType ticketType = ticketTypeRepository.findById(itemReq.getTicketTypeId())
                    .orElseThrow(() -> new AppException(ErrorCode.TICKET_TYPE_NOT_FOUND));

            if (now.isBefore(ticketType.getSaleStart()) || now.isAfter(ticketType.getSaleEnd())) {
                throw new AppException(ErrorCode.TICKET_SALE_TIME_INVALID);
            }

            // Validate quantity
            if(itemReq.getQuantity() < 0) {
                throw new AppException(ErrorCode.INVALID_QUANTITY);
            }

            int available = ticketType.getQuantity() - ticketType.getSoldQuantity();
            if (available < itemReq.getQuantity()) {
                throw new AppException(ErrorCode.INSUFFICIENT_TICKET_QUANTITY);
            }


            // Calculate total
            BigDecimal subTotal = ticketType.getPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem orderItem = new OrderItem();
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setUnitPrice(ticketType.getPrice());
            orderItem.setSubTotal(subTotal);
            orderItem.setTicketType(ticketType);

            totalAmount = totalAmount.add(subTotal);

            orderItems.add(orderItem);
        }

        // Create Order
        Order order = new Order();
        order.setOrderDate(now);
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setUser(user);

        orderItems.forEach(item -> item.setOrder(order));
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Increase soldQuantity after save order success
        for(OrderItem item : savedOrder.getItems()) {
            TicketType ticketType = item.getTicketType();
            ticketType.setSoldQuantity(ticketType.getSoldQuantity() + item.getQuantity());
            ticketTypeRepository.save(ticketType);
        }

        return orderMapper.toOrderResponse(savedOrder);
    }


}
