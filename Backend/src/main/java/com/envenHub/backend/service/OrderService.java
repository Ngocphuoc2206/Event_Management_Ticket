package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.request.OrderItemRequest;
import com.envenHub.backend.dto.request.OrderRequest;
import com.envenHub.backend.dto.response.OrderDetailResponse;
import com.envenHub.backend.dto.response.OrderResponse;
import com.envenHub.backend.dto.response.PagedResponse;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.entity.Order;
import com.envenHub.backend.entity.OrderItem;
import com.envenHub.backend.entity.TicketType;
import com.envenHub.backend.entity.User;
import com.envenHub.backend.enums.OrderStatus;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.filter.OrderSpecification;
import com.envenHub.backend.mapper.OrderMapper;
import com.envenHub.backend.repository.OrderRepository;
import com.envenHub.backend.repository.PaymentRepository;
import com.envenHub.backend.repository.TicketTypeRepository;
import com.envenHub.backend.repository.UserRepository;
import com.envenHub.backend.service.PaymentGateway.PaymentServiceHelper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final OrderMapper orderMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("orderDate", "fullName", "unitPrice", "ticketTypeName");

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentServiceHelper paymentServiceHelper;

    @Transactional
    public OrderResponse createOrder(OrderRequest request, Authentication authentication) {
        LocalDateTime now = LocalDateTime.now();

        User user = userRepository.findById(authentication.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // init list orderItems, total_amount list orderItems
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {

            // Validate quantity
            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new AppException(ErrorCode.INVALID_QUANTITY);
            }

            TicketType ticketType = ticketTypeRepository.findByIdForUpdate(itemReq.getTicketTypeId())
                    .orElseThrow(() -> new AppException(ErrorCode.TICKET_TYPE_NOT_FOUND));

            if (now.isBefore(ticketType.getSaleStart()) || now.isAfter(ticketType.getSaleEnd())) {
                throw new AppException(ErrorCode.TICKET_SALE_TIME_INVALID);
            }

            int sold = ticketType.getSoldQuantity() == null ? 0 : ticketType.getSoldQuantity();
            int total = ticketType.getQuantity() == null ? 0 : ticketType.getQuantity();
            int available = total - sold;

            if (available < itemReq.getQuantity()) {
                throw new AppException(ErrorCode.INSUFFICIENT_TICKET_QUANTITY);
            }
            //Reserve in transaction
            ticketType.setSoldQuantity(sold + itemReq.getQuantity());

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

        return orderMapper.toOrderResponse(savedOrder);
    }

    public PagedResponse<OrderResponse> getAllOrders(
            int page,
            int size,
            String search,
            String orderStatus,
            String sortBy,
            String sortDir,
            Authentication authentication
    ) {
        UserResponse user = userService.getCurrentUser(authentication);
        String userId = user.getId();

        if(!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new AppException(ErrorCode.INVALID_SORT_FIELD);
        }

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Order> specification = Specification
                .where(OrderSpecification.belongsToUser(userId))
                .and(OrderSpecification.hasOrderStatus(orderStatus))
                .and(OrderSpecification.hasSearch(search));

        Page<Order> result = orderRepository.findAll(specification, pageable);

        List<OrderResponse> orders = orderMapper.toOrderResponseList(result.getContent());

        return PagedResponse.<OrderResponse>builder()
                .items(orders)
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .hasNext(result.hasNext())
                .build();
    }

    public OrderDetailResponse getOrderDetail(String orderId, Authentication authentication) {
        UserResponse user = userService.getCurrentUser(authentication);

        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        OrderDetailResponse response = orderMapper.toOrderDetailResponse(order);
        response.setPaymentStatus(paymentServiceHelper.getPaymentStatus(order));

        return response;
    }

}
