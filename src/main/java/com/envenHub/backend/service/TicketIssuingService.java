package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.response.IssuedTicketResponse;
import com.envenHub.backend.entity.IssuedTicket;
import com.envenHub.backend.entity.Order;
import com.envenHub.backend.entity.OrderItem;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.repository.IssuedTicketRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TicketIssuingService {
    @Autowired
    private IssuedTicketRepository issuedTicketRepository;

    @Autowired
    private QrCodeService qrCodeService;

    @Transactional
    public void issueTicketsForOrder(Order order) {
        if (issuedTicketRepository.existsByOrderId(order.getId())) {
            return; // idempotent
        }

        for (OrderItem item : order.getItems()) {
            for (int i = 0; i < item.getQuantity(); i++) {
                String ticketCode = generateUniqueTicketCode();

                IssuedTicket ticket = new IssuedTicket();
                ticket.setOrder(order);
                ticket.setOrderItem(item);
                ticket.setUser(order.getUser());
                ticket.setEvent(item.getTicketType().getEvent());
                ticket.setTicketCode(ticketCode);
                //Upload QR s3
                String qrUrl = qrCodeService.generateAndUploadTicketQr(ticketCode);
                ticket.setQrCodeUrl(qrUrl);

                ticket.setIssuedAt(LocalDateTime.now());
                ticket.setUsed(false);

                issuedTicketRepository.save(ticket);
            }
        }
    }

    //User get ticket QR
    public List<IssuedTicketResponse> getMyTickets(Authentication authentication){
        String userId = authentication.getName();

        return issuedTicketRepository.findByUserIdOrderByIssuedAtDesc(userId)
                .stream().map(this::toResponse)
                .toList();
    }

    private IssuedTicketResponse toResponse(IssuedTicket ticket){
        IssuedTicketResponse response = new IssuedTicketResponse();
        response.setId(ticket.getId());
        response.setTicketCode(ticket.getTicketCode());
        response.setQrCodeUrl(ticket.getQrCodeUrl());
        response.setUsed(ticket.isUsed());
        response.setIssuedAt(ticket.getIssuedAt());

        response.setOrderId(ticket.getOrder().getId());
        response.setEventId(ticket.getEvent().getId());
        response.setEventName(ticket.getEvent().getVenueName());
        response.setTicketTypeId(ticket.getOrderItem().getTicketType().getId());
        response.setTicketTypeName(ticket.getOrderItem().getTicketType().getName());

        return response;
    }

    private String generateUniqueTicketCode() {
        String code;
        do {
            code = "TIX-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        } while (issuedTicketRepository.existsByTicketCode(code));
        return code;
    }
}
