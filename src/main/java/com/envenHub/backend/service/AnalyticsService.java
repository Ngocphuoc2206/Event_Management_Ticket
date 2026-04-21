package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.common.TimeRange;
import com.envenHub.backend.dto.response.AnalyticsResponse.*;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.entity.Event;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.repository.EventRepository;
import com.envenHub.backend.repository.OrderItemRepository;
import com.envenHub.backend.repository.OrderRepository;
import com.envenHub.backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final UserService userService;
    private final EventRepository eventRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final TicketTypeRepository ticketTypeRepository;

    public AnalyticsResponse getAnalytics(
            String eventId,
            String range,
            Authentication authentication
    ) {
        UserResponse user = userService.getCurrentUser(authentication);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(()-> new AppException(ErrorCode.EVENT_NOT_FOUND));

        TimeRange rangeData = resolveRange(range);

        if(!event.getOrganizerId().equals(user.getId())) {
            throw new AppException(ErrorCode.FORBIDDEN_EVENT_ACCESS);
        }

        // Handle Range
        LocalDateTime from = rangeData.from();
        LocalDateTime to = rangeData.to();

        // Summary
        Long totalTickets = orderItemRepository.getTotalTickets(eventId);
        BigDecimal revenue = orderRepository.getTotalRevenue(eventId);

        Long checkedIn = ticketTypeRepository.countCheckedIn(eventId);
        Long totalIssued = ticketTypeRepository.countTotalTickets(eventId);

        double rate = totalIssued == 0 ? 0 : (double) checkedIn / totalIssued;

        // Chart
        List<RevenueByDateResponse> revenueChart = orderRepository.getRevenueByDate(eventId, from, to);
        List<TicketsByDateResponse> ticketsChart = orderItemRepository.getTicketsByDate(eventId, from, to);

        return AnalyticsResponse.builder()
                .summary(Summary.builder()
                        .totalTicketsSold(totalTickets)
                        .totalRevenue(revenue)
                        .checkInRate(rate)
                        .build())
                .performance(Performance.builder()
                        .checkedIn(checkedIn)
                        .notCheckedIn(totalIssued - checkedIn)
                        .build())
                .revenueByDate(revenueChart)
                .ticketsByDate(ticketsChart)
                .build();
    }

    public TimeRange resolveRange(String range) {
        LocalDateTime to = LocalDateTime.now();
        LocalDateTime from = switch (range) {
            case "7d" -> to.minusDays(7);
            case "30d" -> to.minusDays(30);
            case "this_week" -> to.with(DayOfWeek.MONDAY);
            case "this_month" -> to.withDayOfMonth(1);
            default -> throw new AppException(ErrorCode.INVALID_RANGE);
        };

        return new TimeRange(from, to);
    }
}
