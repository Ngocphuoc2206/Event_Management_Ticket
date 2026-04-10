package com.envenHub.backend.filter;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.entity.TicketType;
import com.envenHub.backend.enums.TicketTypeStatus;
import com.envenHub.backend.exception.AppException;
import org.springframework.data.jpa.domain.Specification;

public class TicketTypeSpecification {
    public static Specification<TicketType> belongsToEvent(String eventId) {
        return (root, query, cb) ->
                cb.equal(root.get("event").get("id"), eventId);
    }

    public static Specification<TicketType> belongsToOrganizer(String organizerId) {
        return (root, query, cb) ->
                organizerId == null ? null :
                        cb.equal(root.get("event").get("organizerId"), organizerId);
    }

    public static Specification<TicketType> hasSearch(String search){
        return ((root, query, cb) -> {
            if (search == null || search.isBlank()) return null;

            String keyword = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), keyword)
            );
        });
    }

    public static Specification<TicketType> hasStatus(String status) {
        return (root, query, cb) -> {
            if (status == null || status.isBlank()) {
                return null;
            }
            try {
                TicketTypeStatus ticketTypeStatus = TicketTypeStatus.valueOf(status.toUpperCase());
                return cb.equal(root.get("status"), ticketTypeStatus);
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_TICKET_STATUS);
            }
        };
    }


}
