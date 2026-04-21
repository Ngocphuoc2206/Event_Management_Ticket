package com.envenHub.backend.repository;

import com.envenHub.backend.dto.response.AnalyticsResponse.RevenueByDateResponse;
import com.envenHub.backend.dto.response.AnalyticsResponse.TicketsByDateResponse;
import com.envenHub.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, String>, JpaSpecificationExecutor<OrderItem> {
    @Query("""
        SELECT SUM(oi.quantity)
        FROM OrderItem oi
        JOIN oi.order o
        WHERE o.status = 'PAID'
        AND oi.ticketType.event.id = :eventId
        """)
    Long getTotalTickets(String eventId);

    @Query("""
        SELECT new com.envenHub.backend.dto.response.AnalyticsResponse.TicketsByDateResponse(
            DATE(o.orderDate),
            SUM(oi.quantity)
        )
        FROM OrderItem oi
        JOIN oi.order o
        WHERE o.status = 'PAID'
        AND oi.ticketType.event.id = :eventId
        AND o.orderDate BETWEEN :from AND :to
        GROUP BY DATE(o.orderDate)
        ORDER BY DATE(o.orderDate)
        """)
    List<TicketsByDateResponse> getTicketsByDate(
            @Param("eventId") String eventId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );



}
