# Frontend-callable API inventory (backend)

Nguồn thống kê dựa trên các `@RequestMapping`/`@*Mapping` trong các controller và rule xác thực ở `SecurityConfig`.

## 1) Public APIs (không cần access token)

| Method | Endpoint                     | Mô tả ngắn                                       | Ghi chú                                  |
| ------ | ---------------------------- | ------------------------------------------------ | ---------------------------------------- |
| GET    | `/api/health`                | Health check backend                             | Public endpoint                          |
| POST   | `/api/auth/register`         | Đăng ký tài khoản                                | Public endpoint                          |
| POST   | `/api/auth/login`            | Đăng nhập, trả access token + set refresh cookie | Public endpoint                          |
| POST   | `/api/auth/refresh`          | Làm mới access token từ cookie refresh token     | Public endpoint                          |
| GET    | `/api/events`                | Lấy danh sách sự kiện public                     | Public endpoint theo HTTP GET            |
| GET    | `/api/events/{id}`           | Lấy chi tiết sự kiện public                      | Public endpoint theo HTTP GET            |
| POST   | `/api/payments/webhook/mock` | Mock webhook thanh toán                          | Mở public qua `/api/payments/webhook/**` |

## 2) APIs cần đăng nhập (JWT)

### 2.1 User/Auth profile

| Method | Endpoint             | Mô tả ngắn                     |
| ------ | -------------------- | ------------------------------ |
| GET    | `/api/auth/users/me` | Lấy thông tin profile hiện tại |
| PUT    | `/api/auth/users/me` | Cập nhật profile               |
| POST   | `/api/auth/logout`   | Đăng xuất (xóa refresh token)  |

### 2.2 Customer order/payment/ticket/notification

| Method | Endpoint                                   | Mô tả ngắn                           |
| ------ | ------------------------------------------ | ------------------------------------ |
| GET    | `/api/orders/me`                           | Danh sách đơn hàng của user hiện tại |
| GET    | `/api/orders/{id}/me`                      | Chi tiết đơn hàng của user hiện tại  |
| POST   | `/api/orders`                              | Tạo order                            |
| POST   | `/api/payments/init`                       | Khởi tạo thanh toán cho order        |
| GET    | `/api/me/tickets`                          | Danh sách vé của user hiện tại       |
| GET    | `/api/me/tickets/{id}`                     | Chi tiết vé của user hiện tại        |
| POST   | `/api/me/tickets/check-in`                 | Check-in bằng QR/token vé            |
| GET    | `/api/customer/me/notifications`           | Danh sách thông báo của customer     |
| PATCH  | `/api/customer/me/notifications/{id}/read` | Đánh dấu thông báo đã đọc            |

### 2.3 Organizer APIs

| Method | Endpoint                                  | Mô tả ngắn                      |
| ------ | ----------------------------------------- | ------------------------------- |
| GET    | `/api/organizer/events`                   | Danh sách sự kiện của organizer |
| GET    | `/api/organizer/events/{id}`              | Chi tiết sự kiện của organizer  |
| GET    | `/api/organizer/events/{id}/ticket-types` | Danh sách loại vé của event     |
| GET    | `/api/organizer/events/{id}/attendees`    | Danh sách attendee của event    |
| POST   | `/api/organizer/events`                   | Tạo event                       |
| POST   | `/api/organizer/events/{id}/ticket-types` | Tạo loại vé                     |
| PUT    | `/api/organizer/ticket-types/{id}`        | Cập nhật loại vé                |
| PUT    | `/api/organizer/events/{id}`              | Cập nhật event                  |
| PUT    | `/api/organizer/events/{id}/submit`       | Submit event để duyệt           |
| DELETE | `/api/organizer/ticket-types/{id}`        | Xóa loại vé                     |

### 2.4 Admin APIs

| Method | Endpoint                         | Mô tả ngắn                |
| ------ | -------------------------------- | ------------------------- |
| GET    | `/api/admin/users`               | Danh sách user            |
| GET    | `/api/admin/users/{id}`          | Chi tiết user             |
| PATCH  | `/api/admin/users/{id}/status`   | Cập nhật trạng thái user  |
| GET    | `/api/admin/events/pending`      | Danh sách event chờ duyệt |
| POST   | `/api/admin/events/{id}/approve` | Duyệt event               |
| POST   | `/api/admin/events/{id}/reject`  | Từ chối event             |

### 2.5 Media upload

| Method | Endpoint            | Mô tả ngắn      |
| ------ | ------------------- | --------------- |
| POST   | `/api/media/upload` | Upload file ảnh |

## 3) Ghi chú phân quyền từ SecurityConfig

- Public explicit: `/api/health`, `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/payments/webhook/**`.
- Public theo method: `GET /api/events` và `GET /api/events/**`.
- `/api/admin/**` yêu cầu role `ADMIN`.
- `/api/customer/**` yêu cầu role `CUSTOMER`.
- Các route còn lại mặc định `authenticated()`.
- Rule cụ thể cho organizer (`/api/organizer/**`) đang bị comment trong `SecurityConfig`, nên hiện tại phụ thuộc vào logic service/method và rule authenticated mặc định.

## 4) Tổng số endpoint theo nhóm

- Public: **7**
- Authenticated non-admin (bao gồm user/customer/order/payment/ticket/media/organizer): **23**
- Admin-only: **6**
- **Tổng cộng: 36 endpoints**
