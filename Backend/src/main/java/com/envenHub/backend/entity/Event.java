package com.envenHub.backend.entity;

import com.envenHub.backend.enums.EventStatus;
import com.envenHub.backend.enums.EventVisibility;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    @Column(length = 500)
    private String shortDescription;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String category;
    private String venueName;
    private String address;
    private String city;
    private String bannerUrl;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private EventStatus status; //DRAFT, PUBLISHED, CANCELLED, APPROVED, REJECTED, PENDING

    @Enumerated(EnumType.STRING)
    private EventVisibility visibility; //PUBLIC, PRIVATE

    private String organizerName;
    private String organizerId;

    private BigDecimal minPrice;
    private Integer totalTickets;
    private Integer availableTickets;
    private Boolean featured;

    @CreationTimestamp
    private LocalDateTime createAt;

    @UpdateTimestamp
    private LocalDateTime updateAt;

    @Column(columnDefinition = "TEXT")
    private String rejectReason;
}
