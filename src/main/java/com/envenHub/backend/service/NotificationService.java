package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.response.NotificationResponse;
import com.envenHub.backend.entity.Notification;
import com.envenHub.backend.entity.Order;
import com.envenHub.backend.enums.NotificationType;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.repository.NotificationRepository;
import com.envenHub.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    private void createNotification(
            Order order,
            NotificationType notificationType,
            String title,
            String content
    ){
        if (order == null || order.getUser() == null){
            log.warn(
                    "createNotification skipped: order or order.user is null, notificationType={}",
                    notificationType
            );
            return;
        }
        log.info(
                "createNotification called: orderId={}, userId={}, notificationType={}",
                order.getId(), order.getUser().getId(), notificationType
        );
        Notification notification = new Notification();
        notification.setUser(order.getUser());
        notification.setTitle(title);
        notification.setContent(content);
        notification.setNotificationType(notificationType);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setOrderId(order.getId());
        log.info(
                "createNotification success: orderId={}, userId={}, notificationType={}",
                order.getId(), order.getUser().getId(), notificationType
        );
        notificationRepository.save(notification);
    }

    public void notifyTicketPurchaseSuccess(Order order) {
        log.info("notifyTicketPurchaseSuccess called: orderId={}", order != null ? order.getId() : null);

        createNotification(
                order,
                NotificationType.TICKET_PURCHASE_SUCCESS,
                "Bạn đã thanh toán thành công",
                "Bạn đã mua vé thành công cho sự kiện "
                        + order.getItems().getFirst().getTicketType().getEvent().getTitle()
                        + ". Mã đơn hàng: " + order.getId()
        );
        log.info("notifyTicketPurchaseSuccess completed: orderId={}", order != null ? order.getId() : null);

    }

    public void notifyPaymentFailed(Order order) {
        createNotification(
                order,
                NotificationType.PAYMENT_FAILED,
                "Thanh toán thất bại",
                "Thanh toán cho đơn " + order.getId() + " đã thất bại"
        );
        log.info("notifyPaymentFailed completed: orderId={}", order != null ? order.getId() : null);

    }

    public void notifyOrderCancelled(Order order) {
        createNotification(
                order,
                NotificationType.ORDER_CANCELLED,
                "Đơn hàng bị hủy",
                "Đơn hàng " + order.getId() + " đã bị hủy"
        );
        log.info("notifyOrderCancelled completed: orderId={}", order != null ? order.getId() : null);

    }

    public void notifyEventReminder(Order order, String eventName) {
        createNotification(
                order,
                NotificationType.EVENT_REMINDER,
                "Sắp diễn ra sự kiện",
                "Sự kiện " + eventName + " sắp diễn ra"
        );
        log.info(
                "notifyEventReminder completed: orderId={}, eventName={}",
                order != null ? order.getId() : null, eventName
        );
    }

    public List<NotificationResponse> getMyNotifications(Authentication authentication) {
        String userId = authentication.getName();
        log.info("getMyNotifications called: userId={}", userId);

        userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("getMyNotifications failed: user not found, userId={}", userId);
                    return new AppException(ErrorCode.USER_NOT_FOUND);
                });

        List<NotificationResponse> responses = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();

        log.info("getMyNotifications success: userId={}, totalNotifications={}", userId, responses.size());
        return responses;
    }

    public NotificationResponse markAsRead(String notificationId, Authentication authentication){
        String userId = authentication.getName();
        log.info("markAsRead called: notificationId={}, userId={}", notificationId, userId);

        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> {
                    log.warn(
                            "markAsRead failed: notification not found, notificationId={}, userId={}",
                            notificationId, userId
                    );
                    return new AppException(ErrorCode.NOTIFICATION_NOT_FOUND);
                });

        if (!notification.isRead()){
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
            log.info("markAsRead success: notificationId={}, userId={}", notificationId, userId);

        } else {
            log.info("markAsRead skipped: notification already read, notificationId={}, userId={}", notificationId, userId);
        }
        return toResponse(notification);
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .content(notification.getContent())
                .type(notification.getNotificationType())
                .isRead(notification.isRead())
                .readAt(notification.getReadAt())
                .createdAt(notification.getCreatedAt())
                .orderId(notification.getOrderId())
                .build();
    }
}
