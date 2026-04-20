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
    public List<IssuedTicketResponse> getMyTickets(Authentication authentication, String type){
        String userId = authentication.getName();
        LocalDateTime now = LocalDateTime.now();
        List<IssuedTicket> tickets;
        if (type == null || type.isBlank()){
            tickets = issuedTicketRepository.findByUserIdOrderByIssuedAtDesc(userId);
        } else if ("upcoming".equalsIgnoreCase(type)){
            tickets = issuedTicketRepository
                    .findByUserIdAndEvent_StartTimeGreaterThanEqualOrderByIssuedAtDesc(userId, now);
        }  else if ("past".equalsIgnoreCase(type)) {
            tickets = issuedTicketRepository
                    .findByUserIdAndEvent_EndTimeLessThanOrderByIssuedAtDesc(userId, now);
        } else {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        return tickets.stream()
                .map(this::toResponse)
                .toList();
    }

    public IssuedTicketResponse getMyTicketDetail(String ticketId, Authentication authentication) {
        String userId = authentication.getName();

        IssuedTicket ticket = issuedTicketRepository.findByIdAndUserId(ticketId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_NOT_FOUND));
        return toResponse(ticket);
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
        response.setEventName(ticket.getEvent().getTitle());
        response.setVenueName(ticket.getEvent().getVenueName());
        response.setAddress(ticket.getEvent().getAddress());
        response.setCity(ticket.getEvent().getCity());
        response.setEventStartTime(ticket.getEvent().getStartTime());
        response.setEventEndTime(ticket.getEvent().getEndTime());

        response.setTicketTypeId(ticket.getOrderItem().getTicketType().getId());
        response.setTicketTypeName(ticket.getOrderItem().getTicketType().getName());

        response.setTicketCategory(resolveTicketCategory(ticket));
        return response;
    }

    private String resolveTicketCategory(IssuedTicket ticket){
        LocalDateTime now = LocalDateTime.now();

        if (ticket.getEvent().getEndTime() != null && ticket.getEvent().getEndTime().isBefore(now)){
            return "PAST";
        }
        return "UPCOMING";
    }

    private String generateUniqueTicketCode() {
        String code;
        do {
            code = "TIX-" + UUID.randomUUID().toString()
                    .replace("-", "").substring(0, 12).toUpperCase();
        } while (issuedTicketRepository.existsByTicketCode(code));
        return code;
    }
}
