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
    private String venueName;
    private String address;
    private String city;
    private LocalDateTime eventStartTime;
    private LocalDateTime eventEndTime;

    private String ticketTypeId;
    private String ticketTypeName;
    private String ticketCategory; // UPCOMING / PAST

}
