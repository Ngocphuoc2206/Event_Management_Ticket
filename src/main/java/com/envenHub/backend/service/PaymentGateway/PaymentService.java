package com.envenHub.backend.service.PaymentGateway;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.request.PaymentGatewayInitRequest;
import com.envenHub.backend.dto.request.PaymentInitRequest;
import com.envenHub.backend.dto.request.PaymentWebhookRequest;
import com.envenHub.backend.dto.response.PaymentGatewayInitResponse;
import com.envenHub.backend.dto.response.PaymentInitResponse;
import com.envenHub.backend.dto.response.PaymentWebhookResponse;
import com.envenHub.backend.entity.Order;
import com.envenHub.backend.entity.Payment;
import com.envenHub.backend.entity.User;
import com.envenHub.backend.enums.OrderStatus;
import com.envenHub.backend.enums.PaymentMethod;
import com.envenHub.backend.enums.PaymentStatus;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.repository.OrderRepository;
import com.envenHub.backend.repository.PaymentRepository;
import com.envenHub.backend.repository.UserRepository;
import com.envenHub.backend.service.TicketIssuingService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private List<PaymentGatewayInterface> paymentGatewayInterfaces;

    @Autowired
    private TicketIssuingService ticketIssuingService;

    @Transactional
    public PaymentInitResponse initPayment(PaymentInitRequest request, Authentication authentication){
        //validate request
        if (request == null || request.getOrderId() == null || request.getOrderId().isBlank()){
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        //Get payment method
        PaymentMethod paymentMethod = request.getPaymentMethod() == null ?
                PaymentMethod.MOCK : request.getPaymentMethod();

        //Find user
        User user = userRepository.findById(authentication.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Get order
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        //Check order belong to user
        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())){
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        //Check status order
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT){
            throw new AppException(ErrorCode.ORDER_NOT_PAYABLE);
        }

        //Check payment already has status PENDING
        paymentRepository.findFirstByOrderIdAndPaymentStatusOrderByCreatedAtDesc(order.getId(), PaymentStatus.PENDING)
                .ifPresent(p -> {
                    throw new AppException(ErrorCode.PAYMENT_ALREADY_PENDING);
                });

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setExpiredAt(LocalDateTime.now().plusMinutes(15));

        payment = paymentRepository.save(payment);

        //Call gateway
        PaymentGatewayInterface gatewayService = paymentGatewayInterfaces.stream()
                .filter(s -> s.getSupportedMethod() == paymentMethod)
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_METHOD_NOT_SUPPORTED));

        PaymentGatewayInitResponse gatewayResponse = gatewayService.initPayment(
                PaymentGatewayInitRequest.builder()
                        .paymentId(payment.getId())
                        .orderId(order.getId())
                        .amount(order.getTotalAmount())
                        .build()
        );

        payment.setProvider(gatewayResponse.getProvider());
        payment.setProviderTransactionId(gatewayResponse.getProviderTransactionId());
        payment.setPaymentUrl(gatewayResponse.getPaymentUrl());
        payment.setClientSecret(gatewayResponse.getClientSecret());

        payment = paymentRepository.save(payment);

        return PaymentInitResponse.builder()
                .paymentId(payment.getId())
                .orderId(order.getId())
                .amount(payment.getAmount())
                .method(payment.getPaymentMethod())
                .status(payment.getPaymentStatus())
                .provider(payment.getProvider())
                .providerTransactionId(payment.getProviderTransactionId())
                .paymentUrl(payment.getPaymentUrl())
                .clientSecret(payment.getClientSecret())
                .createdAt(payment.getCreatedAt())
                .expiredAt(payment.getExpiredAt())
                .build();
    }

    @Transactional
    public PaymentWebhookResponse handleWebhook(PaymentWebhookRequest request) {
        //Validate request
        if (request == null || request.getPaymentId() == null || request.getOrderId() == null) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        //Find payment
        Payment payment = paymentRepository.findByIdForUpdate(request.getPaymentId())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getOrder() == null || !payment.getOrder().getId().equals(request.getOrderId())) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        //Lock payment record
        PaymentGatewayInterface gatewayService = paymentGatewayInterfaces.stream()
                .filter(s -> s.getSupportedMethod() == payment.getPaymentMethod())
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_METHOD_NOT_SUPPORTED));

        //Verify signature
        boolean validSignature = gatewayService.verifyWebhookSignature(request);
        if (!validSignature) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        // idempotent: if payment is success then return
        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
            return PaymentWebhookResponse.builder()
                    .success(true)
                    .message("Webhook already processed")
                    .build();
        }

        PaymentStatus newStatus = gatewayService.mapWebhookStatus(request);
        payment.setPaymentStatus(newStatus);
        payment.setUpdatedAt(LocalDateTime.now());
        payment.setWebhookEventId(request.getEventId());
        payment.setWebhookPayload(request.getRawData());

        Order order = payment.getOrder();

        if (newStatus == PaymentStatus.SUCCESS) {
            order.setStatus(OrderStatus.PAID);
            // trigger issue ticket
            ticketIssuingService.issueTicketsForOrder(order);

        } else if (newStatus == PaymentStatus.FAILED
                || newStatus == PaymentStatus.CANCELLED
                || newStatus == PaymentStatus.EXPIRED) {
            order.setStatus(OrderStatus.CANCELLED);
        }

        paymentRepository.save(payment);
        orderRepository.save(order);

        return PaymentWebhookResponse.builder()
                .success(true)
                .message("Webhook processed successfully")
                .build();
    }
}
