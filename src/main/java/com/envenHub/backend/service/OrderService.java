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
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
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
        String userId = authentication.getName();

        log.info("createOrder called: userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("createOrder failed: user not found, userId={}", userId);
                    return new AppException(ErrorCode.USER_NOT_FOUND);
                });

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            log.info(
                    "createOrder processing item: userId={}, ticketTypeId={}, quantity={}",
                    userId, itemReq.getTicketTypeId(), itemReq.getQuantity()
            );

            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                log.warn(
                        "createOrder failed: invalid quantity, userId={}, ticketTypeId={}, quantity={}",
                        userId, itemReq.getTicketTypeId(), itemReq.getQuantity()
                );
                throw new AppException(ErrorCode.INVALID_QUANTITY);
            }

            TicketType ticketType = ticketTypeRepository.findByIdForUpdate(itemReq.getTicketTypeId())
                    .orElseThrow(() -> {
                        log.warn(
                                "createOrder failed: ticket type not found, userId={}, ticketTypeId={}",
                                userId, itemReq.getTicketTypeId()
                        );
                        return new AppException(ErrorCode.TICKET_TYPE_NOT_FOUND);
                    });

            if (now.isBefore(ticketType.getSaleStart()) || now.isAfter(ticketType.getSaleEnd())) {
                log.warn(
                        "createOrder failed: ticket sale time invalid, userId={}, ticketTypeId={}, saleStart={}, saleEnd={}, now={}",
                        userId, ticketType.getId(), ticketType.getSaleStart(), ticketType.getSaleEnd(), now
                );
                throw new AppException(ErrorCode.TICKET_SALE_TIME_INVALID);
            }

            int sold = ticketType.getSoldQuantity() == null ? 0 : ticketType.getSoldQuantity();
            int total = ticketType.getQuantity() == null ? 0 : ticketType.getQuantity();
            int available = total - sold;

            if (available < itemReq.getQuantity()) {
                log.warn(
                        "createOrder failed: insufficient ticket quantity, userId={}, ticketTypeId={}, requested={}, available={}",
                        userId, ticketType.getId(), itemReq.getQuantity(), available
                );
                throw new AppException(ErrorCode.INSUFFICIENT_TICKET_QUANTITY);
            }

            ticketType.setSoldQuantity(sold + itemReq.getQuantity());

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

        Order order = new Order();
        order.setOrderDate(now);
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setUser(user);

        orderItems.forEach(item -> item.setOrder(order));
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        log.info(
                "createOrder success: orderId={}, userId={}, itemCount={}, totalAmount={}, status={}",
                savedOrder.getId(), userId, orderItems.size(), totalAmount, savedOrder.getStatus()
        );

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

        log.info(
                "getAllOrders called: userId={}, page={}, size={}, search={}, orderStatus={}, sortBy={}, sortDir={}",
                userId, page, size, search, orderStatus, sortBy, sortDir
        );

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            log.warn("getAllOrders failed: invalid sort field={}, userId={}", sortBy, userId);
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

        log.info(
                "getAllOrders success: userId={}, returnedItems={}, totalItems={}, totalPages={}",
                userId, orders.size(), result.getTotalElements(), result.getTotalPages()
        );

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
        String userId = user.getId();

        log.info("getOrderDetail called: orderId={}, userId={}", orderId, userId);

        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> {
                    log.warn("getOrderDetail failed: order not found, orderId={}, userId={}", orderId, userId);
                    return new AppException(ErrorCode.ORDER_NOT_FOUND);
                });

        OrderDetailResponse response = orderMapper.toOrderDetailResponse(order);
        response.setPaymentStatus(paymentServiceHelper.getPaymentStatus(order));

        log.info(
                "getOrderDetail success: orderId={}, userId={}, orderStatus={}, paymentStatus={}",
                orderId, userId, order.getStatus(), response.getPaymentStatus()
        );

        return response;
    }
}