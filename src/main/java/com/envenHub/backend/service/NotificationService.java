package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.response.NotificationResponse;
import com.envenHub.backend.entity.Notification;
import com.envenHub.backend.entity.Order;
import com.envenHub.backend.entity.User;
import com.envenHub.backend.enums.NotificationType;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.repository.NotificationRepository;
import com.envenHub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
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
            return;
        }

        Notification notification = new Notification();
        notification.setUser(order.getUser());
        notification.setTitle(title);
        notification.setContent(content);
        notification.setNotificationType(notificationType);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setOrderId(order.getId());

        notificationRepository.save(notification);
    }

    public void notifyTicketPurchaseSuccess(Order order) {
        createNotification(
                order,
                NotificationType.TICKET_PURCHASE_SUCCESS,
                "Bạn đã thanh toán thành công",
                "Bạn đã mua vé thành công cho sự kiện "
                        + order.getItems().getFirst().getTicketType().getEvent().getTitle()
                        + ". Mã đơn hàng: " + order.getId()
        );
    }

    public void notifyPaymentFailed(Order order) {
        createNotification(
                order,
                NotificationType.PAYMENT_FAILED,
                "Thanh toán thất bại",
                "Thanh toán cho đơn " + order.getId() + " đã thất bại"
        );
    }

    public void notifyOrderCancelled(Order order) {
        createNotification(
                order,
                NotificationType.ORDER_CANCELLED,
                "Đơn hàng bị hủy",
                "Đơn hàng " + order.getId() + " đã bị hủy"
        );
    }

    public void notifyEventReminder(Order order, String eventName) {
        createNotification(
                order,
                NotificationType.EVENT_REMINDER,
                "Sắp diễn ra sự kiện",
                "Sự kiện " + eventName + " sắp diễn ra"
        );
    }

    public List<NotificationResponse> getMyNotifications(Authentication authentication) {
        String userId = authentication.getName();

        userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse)
                .toList();
    }

    public NotificationResponse markAsRead(String notificationId, Authentication authentication){
        String userId = authentication.getName();

        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        if (!notification.isRead()){
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
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
