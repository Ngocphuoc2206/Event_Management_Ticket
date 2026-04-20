package com.envenHub.backend.entity;

import com.envenHub.backend.enums.TicketTypeStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
public class TicketType {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private BigDecimal price;
    private Integer quantity;
    private Integer soldQuantity;
    private LocalDateTime saleStart;
    private LocalDateTime saleEnd;

    @Enumerated(EnumType.STRING)
    private TicketTypeStatus status;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
}
