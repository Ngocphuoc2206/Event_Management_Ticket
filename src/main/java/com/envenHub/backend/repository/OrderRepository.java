package com.envenHub.backend.repository;

import com.envenHub.backend.dto.response.AnalyticsResponse.RevenueByDateResponse;
import com.envenHub.backend.dto.response.AnalyticsResponse.TicketsByDateResponse;
import com.envenHub.backend.entity.Order;
import com.envenHub.backend.entity.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {
    Optional<Order> findByIdAndUserId(String orderId, String userId);

    @Query("""
            SELECT SUM(o.totalAmount)
            FROM Order o
            JOIN o.items oi
            WHERE o.status = 'PAID'
            AND oi.ticketType.event.id = :eventId
        """)
    BigDecimal getTotalRevenue(String eventId);

    @Query("""
            SELECT new com.envenHub.backend.dto.response.AnalyticsResponse.RevenueByDateResponse(
                DATE(o.orderDate),
                SUM(o.totalAmount)
            )
            FROM Order o
            JOIN o.items oi
            WHERE o.status = 'PAID'
            AND oi.ticketType.event.id = :eventId
            AND o.orderDate BETWEEN :from AND :to
            GROUP BY DATE(o.orderDate)
            ORDER BY DATE(o.orderDate)
        """)
    List<RevenueByDateResponse> getRevenueByDate(
            @Param("eventId") String eventId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
