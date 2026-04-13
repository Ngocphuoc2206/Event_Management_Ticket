package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.entity.IssuedTicket;
import com.envenHub.backend.entity.Order;
import com.envenHub.backend.entity.OrderItem;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.repository.IssuedTicketRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketIssuingService {

    private final IssuedTicketRepository issuedTicketRepository;

    @Transactional
    public void issueTicketsForOrder(Order order) {
        if (issuedTicketRepository.existsByOrderId(order.getId())) {
            throw new AppException(ErrorCode.TICKET_ALREADY_ISSUED); // idempotent
        }

        for (OrderItem item : order.getItems()) {
            for (int i = 0; i < item.getQuantity(); i++) {
                IssuedTicket ticket = new IssuedTicket();
                ticket.setOrder(order);
                ticket.setOrderItem(item);
                ticket.setTicketCode(UUID.randomUUID().toString());
                ticket.setQrCodeUrl(null); // làm sau nếu chưa có QR
                ticket.setIssuedAt(LocalDateTime.now());
                issuedTicketRepository.save(ticket);
            }
        }
    }
}
