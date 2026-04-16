package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.response.IssuedTicketResponse;
import com.envenHub.backend.entity.IssuedTicket;
import com.envenHub.backend.service.TicketIssuingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/me/tickets")
public class TicketController {
    @Autowired
    private TicketIssuingService ticketIssuingService;

    @GetMapping
    public ApiResponse<List<IssuedTicketResponse>> getMyTickets(
            Authentication authentication,
            @RequestParam(required = false) String type){
        return ApiResponse.<List<IssuedTicketResponse>>builder()
                .results(ticketIssuingService.getMyTickets(authentication, type))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<IssuedTicketResponse> getMyTicketDetail(
            @PathVariable String id,
            Authentication authentication
    ) {
        return ApiResponse.<IssuedTicketResponse>builder()
                .results(ticketIssuingService.getMyTicketDetail(id, authentication))
                .build();
    }
}
