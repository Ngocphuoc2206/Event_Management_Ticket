package com.envenHub.backend.filter;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.entity.Order;
import com.envenHub.backend.entity.TicketType;
import com.envenHub.backend.enums.OrderStatus;
import com.envenHub.backend.enums.PaymentStatus;
import com.envenHub.backend.exception.AppException;
import org.springframework.data.jpa.domain.Specification;

public class OrderSpecification {
    public static Specification<Order> belongsToUser(String userId) {
        return (root, query, cb) ->
                userId == null ? null :
                        cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Order> hasSearch(String search) {
        return (((root, query, cb) -> {
            if(search == null || search.isBlank()) return null;

            String keyword = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.join("items").join("ticketType").get("name")), keyword)
//                    cb.like(cb.lower(root.join("user").get("fullName")), keyword)
            );
        }));
    }

    public static Specification<Order> hasOrderStatus(String status) {
        return (((root, query, cb) -> {
            if (status == null || status.isBlank()) return null;

            try {
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                return cb.equal(root.get("status"), orderStatus);
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_TICKET_STATUS);
            }
        }));
    }

    public static Specification<Order> hasPaymentStatus(String status) {
        return (((root, query, cb) -> {
            if (status == null || status.isBlank()) return null;
            query.distinct(true);

            try {
                PaymentStatus paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
                return cb.equal(root.join("payments").get("paymentStatus"), paymentStatus);
            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_PAYMENT_STATUS);
            }
        }));
    }
}
