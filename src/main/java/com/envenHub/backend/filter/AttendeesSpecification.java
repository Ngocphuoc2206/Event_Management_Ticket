package com.envenHub.backend.filter;

import com.envenHub.backend.entity.OrderItem;
import org.springframework.data.jpa.domain.Specification;

public class AttendeesSpecification {

    public static Specification<OrderItem> hasEvent(String eventId) {
        return (root, query, cb) ->
                cb.equal(root.get("ticketType").get("event").get("id"), eventId);
    }

    public static Specification<OrderItem> hasSearch(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) return null;

            String keyword = "%" + search.toLowerCase() + "%";

            var user = root.join("order").join("user");
            var ticketType = root.join("ticketType");

            return cb.or(
                    cb.like(cb.lower(user.get("fullName")), keyword),
                    cb.like(cb.lower(user.get("email")), keyword),
                    cb.like(cb.lower(ticketType.get("name")), keyword)
            );
        };
    }

    public static Specification<OrderItem> hasStatus(Boolean status) {
        return (root, query, cb) -> {
            if (status == null) return null;

            return status
                    ? cb.isTrue(root.get("checkedIn"))
                    : cb.isFalse(root.get("checkedIn"));
        };
    }

    public static Specification<OrderItem> sortBy(String sortBy, String sortDir) {
        return (root, query, cb) -> {
            if (sortBy == null) return null;

            boolean isDesc = sortDir.equalsIgnoreCase("desc");

            if (sortBy.equals("fullName")) {
                var user = root.join("order").join("user");
                query.orderBy(isDesc ? cb.desc(user.get("fullName")) : cb.asc(user.get("fullName")));
            }

            if (sortBy.equals("ticketType")) {
                var ticket = root.join("ticketType");
                query.orderBy(isDesc ? cb.desc(ticket.get("name")) : cb.asc(ticket.get("name")));
            }

            return null;
        };
    }
}
