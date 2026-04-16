package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.response.IssuedTicketResponse;
import com.envenHub.backend.entity.IssuedTicket;
import com.envenHub.backend.service.TicketIssuingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    @Autowired
    private TicketIssuingService ticketIssuingService;

    @GetMapping("/me")
    public ApiResponse<List<IssuedTicketResponse>> getMyTickets(Authentication authentication){
        return ApiResponse.<List<IssuedTicketResponse>>builder()
                .results(ticketIssuingService.getMyTickets(authentication))
                .build();
    }
}
