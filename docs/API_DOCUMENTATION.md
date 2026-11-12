<!-- docs/API_DOCUMENTATION.md -->
# Tài Liệu API RESTful (`/api/v1`) — CALEM.CLUB E-Commerce

Tất cả các API đều trả về cấu trúc JSON đồng nhất:

```json
{
  "success": true,
  "message": "Thành công",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 12,
    "totalItems": 48,
    "totalPages": 4
  }
}
```

## 1. Xác thực (`/api/v1/auth`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| POST | `/auth/register` | Public | Đăng ký tài khoản mới + tạo giỏ hàng rỗng |
| POST | `/auth/login` | Public | Đăng nhập (Rate limit 10 lần / 15 phút), trả về `accessToken` + `refreshToken` |
| POST | `/auth/refresh-token` | Public | Cấp lại cặp token mới + đưa refresh token cũ vào Redis blacklist |
| POST | `/auth/logout` | Public | Đưa `refreshToken` vào Redis blacklist |
| POST | `/auth/forgot-password` | Public | Tạo token đặt lại mật khẩu và gửi email khôi phục |
| POST | `/auth/reset-password` | Public | Đặt lại mật khẩu mới bằng token |

## 2. Hồ sơ & Sổ địa chỉ (`/api/v1/users`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/users/me` | User/Admin | Lấy thông tin hồ sơ hiện tại |
| PUT | `/users/me` | User/Admin | Cập nhật họ tên, SĐT, upload ảnh `avatar` (Cloudinary) |
| PUT | `/users/me/password` | User/Admin | Đổi mật khẩu |
| GET | `/users/me/addresses` | User/Admin | Danh sách địa chỉ giao hàng |
| POST | `/users/me/addresses` | User/Admin | Thêm địa chỉ mới |
| PUT | `/users/me/addresses/:id` | User/Admin | Sửa địa chỉ |
| DELETE | `/users/me/addresses/:id` | User/Admin | Xóa địa chỉ |
| PATCH | `/users/me/addresses/:id/default` | User/Admin | Đặt làm địa chỉ mặc định |

## 3. Danh mục, Sản phẩm & Đánh giá
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/categories` | Public | Danh sách danh mục (Cache Redis 5 phút) |
| POST | `/categories` | Admin | Tạo danh mục mới |
| GET | `/products` | Public | Lọc theo `q`, `category`, `gender`, `minPrice`, `maxPrice`, `size`, `color`, `minRating`, `sort`, `page`, `limit` (Cache Redis) |
| GET | `/products/:slug` | Public | Chi tiết sản phẩm kèm `variants` (size/màu/tồn kho) và `images` |
| POST | `/products` | Admin | Tạo sản phẩm + biến thể + upload nhiều ảnh (`multipart/form-data`) |
| PUT | `/products/:id` | Admin | Cập nhật sản phẩm |
| DELETE | `/products/:id` | Admin | Xóa mềm (`paranoid: true`) sản phẩm |
| GET | `/reviews/product/:productId` | Public | Danh sách đánh giá sản phẩm |
| POST | `/reviews` | User/Admin | Đánh giá sản phẩm (Tự động kiểm tra cờ `isVerifiedPurchase`) |

## 4. Giỏ hàng, Yêu thích & Mã giảm giá
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/cart` | User/Admin | Lấy giỏ hàng từ DB (giữ nguyên khi đăng nhập lại) |
| POST | `/cart/items` | User/Admin | Thêm biến thể (`productVariantId`, `quantity`) vào giỏ |
| PUT | `/cart/items/:itemId` | User/Admin | Cập nhật số lượng |
| DELETE | `/cart/items/:itemId` | User/Admin | Xóa 1 dòng sản phẩm khỏi giỏ |
| POST | `/wishlists/toggle` | User/Admin | Thêm/bỏ yêu thích sản phẩm |
| POST | `/coupons/apply` | User/Admin | Kiểm tra mã giảm giá và tính số tiền được giảm |

## 5. Đơn hàng & Thanh toán MoMo Sandbox (`/api/v1/orders` & `/api/v1/payments`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| POST | `/orders` | User/Admin | Tạo đơn hàng trong `sequelize.transaction` với khóa dòng `SELECT ... FOR UPDATE`, trừ tồn kho, lưu snapshot `order_items`, trả về `payUrl` nếu chọn `MOMO` |
| GET | `/orders/my-orders` | User/Admin | Lịch sử đơn hàng của tôi |
| PATCH | `/orders/:orderCode/cancel` | User/Admin | Hủy đơn khi chưa giao + hoàn lại tồn kho |
| POST | `/payments/momo/create` | User/Admin | Tạo lại link thanh toán MoMo cho đơn `pending_payment` |
| POST | `/payments/momo/ipn` | Public (MoMo) | Nhận Webhook IPN từ MoMo, kiểm tra chữ ký HMAC SHA256 (`crypto.timingSafeEqual`) và xử lý idempotent |
| GET | `/payments/momo/verify` | Public | Xác thực chữ ký khi người dùng redirect từ MoMo về `/payment-result` |

## 6. Quản trị viên (`/api/v1/admin`)
| Method | Endpoint | Quyền | Mô tả |
|---|---|---|---|
| GET | `/admin/dashboard/stats` | Admin | Thống kê tổng doanh thu, số đơn, doanh thu 30 ngày / 12 tháng, top sản phẩm bán chạy |
| GET | `/admin/orders` | Admin | Danh sách toàn bộ đơn hàng |
| PATCH | `/admin/orders/:id/status` | Admin | Chuyển trạng thái đơn hàng (`pending_confirmation` → `shipping` → `completed` / `cancelled`) |
| GET | `/admin/users` | Admin | Danh sách người dùng |
| PATCH | `/admin/users/:id/role` | Admin | Phân quyền `user`/`admin` hoặc khóa/mở khóa tài khoản |
