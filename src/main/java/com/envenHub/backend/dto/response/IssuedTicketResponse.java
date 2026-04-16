package com.envenHub.backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IssuedTicketResponse {
    private String id;
    private String ticketCode;
    private String qrCodeUrl;
    private Boolean used;
    private LocalDateTime issuedAt;

    private String orderId;
    private String eventId;
    private String eventName;
    private String ticketTypeId;
    private String ticketTypeName;
}
