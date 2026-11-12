# CALEM.CLUB — Hệ Thống Thương Mại Điện Tử Thời Trang Streetwear

Hệ thống thương mại điện tử Fullstack lấy cảm hứng từ **Calem.Club**, xây dựng theo phong cách **Interactive WebGL & 3D Showroom** dành cho thị trường thời trang streetwear tại Việt Nam.

---

## Mục Lục

- [Tính Năng Chính](#tính-năng-chính)
- [Kiến Trúc & Công Nghệ](#kiến-trúc--công-nghệ)
- [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Hướng Dẫn Cài Đặt & Khởi Chạy](#hướng-dẫn-cài-đặt--khởi-chạy)
- [Kiểm Thử & Chất Lượng Mã Nguồn](#kiểm-thử--chất-lượng-mã-nguồn)
- [Tài Liệu Tham Khảo](#tài-liệu-tham-khảo)

---

## Tính Năng Chính

### 1. Storefront & Trải Nghiệm Tương Tác WebGL / 3D
- **Hero DitherVeil (`DitherVeil.jsx`)**: Hiệu ứng WebGL2 dither tương tác theo chuyển động chuột và click burst.
- **Sàn Diễn Trụ Xoay 3D (`CircularCarousel.jsx`)**: Trình diễn các thiết kế nổi bật theo dạng hình trụ 3D có quán tính kéo, snap và tự động xoay.
- **Thư Viện Thấu Kính Lỏng (`FlexCarousel.jsx`)**: Tích hợp trên giao diện Đăng nhập / Đăng ký (`AuthLayout.jsx`) với hiệu ứng bẻ cong thấu kính WebGL2.
- **Thẻ Sản Phẩm (`ProductCard.jsx`) & Chi Tiết Sản Phẩm (`ProductDetail.jsx`)**: Hiệu ứng nghiêng 3D theo con trỏ, chuyển đổi nhanh biến thể màu sắc/kích cỡ và xem chi tiết chất liệu.

### 2. Mua Sắm, Bảo Mật & Thanh Toán
- **Xác thực JWT**: Access Token & Refresh Token tự động làm mới qua Axios Interceptor, hỗ trợ thu hồi token bằng Redis Blacklist.
- **Giỏ Hàng & Đơn Hàng**: Quản lý tồn kho an toàn bằng Row-Level Locking (`SELECT ... FOR UPDATE`) trong MySQL tránh bán quá số lượng.
- **Thanh Toán Linh Hoạt**:
  - **COD**: Thanh toán khi nhận hàng.
  - **MoMo Sandbox v2**: Tạo `payUrl`, xác thực chữ ký **HMAC SHA256** (`crypto.timingSafeEqual`), xử lý **IPN Idempotent** chống gọi lặp, kết hợp **Cron Job** tự động hủy đơn quá hạn 15 phút và hoàn tồn kho.

### 3. Hệ Thống Quản Trị (Admin Dashboard)
- Thống kê doanh thu, số lượng đơn hàng, khách hàng, sản phẩm và biểu đồ doanh thu theo ngày/tháng.
- Quản lý sản phẩm & biến thể, danh mục, đơn hàng, mã giảm giá, banner và khách hàng.

---

## Kiến Trúc & Công Nghệ

| Thành phần | Công nghệ sử dụng |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router v6, Tailwind CSS, Axios, OGL (WebGL2), Lucide React |
| **Backend** | Node.js, Express.js (MVC + Service Layer), Zod, Multer, Cloudinary, Helmet, Express Rate Limit, Node-cron, Nodemailer, Winston |
| **Database & Cache** | MySQL 8.0 (Sequelize ORM — Migrations & Seeders), Redis 7 (`ioredis`) |
| **Testing** | Vitest + React Testing Library (Client), Jest + Supertest (Server) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## Cấu Trúc Thư Mục

```text
e-commerce/
├── client/                 # Ứng dụng Frontend (React + Vite + Tailwind + OGL)
│   ├── src/
│   │   ├── components/     # UI & WebGL components (CircularCarousel, DitherVeil, FlexCarousel...)
│   │   ├── layouts/        # Storefront, AuthLayout, AdminLayout
│   │   ├── pages/          # Các trang cửa hàng, tài khoản, thanh toán, quản trị
│   │   └── services/       # Cấu hình Axios & API clients
│   └── nginx.conf          # Cấu hình Nginx cho bản build production
├── server/                 # Ứng dụng Backend (Express + Sequelize + Redis)
│   ├── src/
│   │   ├── controllers/    # Xử lý HTTP requests
│   │   ├── services/       # Nghiệp vụ cốt lõi (Order, Payment, Auth, Dashboard...)
│   │   ├── models/         # Sequelize models
│   │   ├── migrations/     # Database migrations
│   │   ├── seeders/        # Dữ liệu mẫu ban đầu
│   │   ├── routes/         # Định nghĩa RESTful API routes (/api/v1)
│   │   └── middlewares/    # Auth, Validate (Zod), Rate limit, Error handler
│   └── server.js           # Entrypoint khởi chạy server
├── docs/                   # Tài liệu kỹ thuật (API, Database ERD, Deployment)
├── docker-compose.yml      # Điều phối 4 services: mysql, redis, server, client
├── Dockerfile.client       # Multi-stage build cho Frontend + Nginx
└── Dockerfile.server       # Build image cho Backend API
```

---

## Yêu Cầu Hệ Thống

- **Chạy bằng Docker (Khuyên dùng)**:
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (hỗ trợ `docker compose`)
- **Chạy trực tiếp trên máy (Local Development)**:
  - Node.js >= 20
  - MySQL 8.0
  - Redis 7

---

## Hướng Dẫn Cài Đặt & Khởi Chạy

### Cách 1: Khởi chạy bằng Docker Compose (Khuyên dùng)

1. Mở **Docker Desktop** và đảm bảo Docker Engine đang hoạt động.
2. Tại thư mục gốc của dự án, chạy lệnh:

```bash
docker compose up --build -d
```

> **Lưu ý trên Windows**: Nếu gặp lỗi `DeadlineExceeded` / timeout khi Docker BuildKit tải metadata image, hãy tắt BuildKit tạm thời rồi chạy lại:
> - PowerShell: `$env:DOCKER_BUILDKIT="0"; $env:COMPOSE_DOCKER_CLI_BUILD="0"; docker compose up --build -d`

3. Kiểm tra trạng thái các container:

```bash
docker compose ps
```

4. Truy cập các dịch vụ:
   - **Storefront & Admin UI**: http://localhost:5173
   - **RESTful API Healthcheck**: http://localhost:5000/api/v1/health
   - **MySQL (Host Port)**: `localhost:3307`
   - **Redis (Host Port)**: `localhost:6379`

---

### Cách 2: Chạy trực tiếp trên máy (Local Development)

#### 1. Khởi chạy Backend (`server`)
```bash
cd server
npm install
# Cấu hình biến môi trường trong file .env (DB_HOST, DB_PORT, REDIS_HOST, JWT_*, MOMO_*)
npm run db:migrate
npm run db:seed
npm run dev
```

#### 2. Khởi chạy Frontend (`client`)
```bash
cd client
npm install
npm run dev
```

---

## Kiểm Thử & Chất Lượng Mã Nguồn

### Backend (`server/`)
```bash
npm test        # Chạy unit & integration tests (Jest + Supertest)
npm run lint    # Kiểm tra cú pháp với ESLint
npm run format  # Định dạng mã nguồn với Prettier
```

### Frontend (`client/`)
```bash
npm test        # Chạy component tests (Vitest + React Testing Library)
npm run lint    # Kiểm tra cú pháp với ESLint
npm run build   # Kiểm tra đóng gói production với Vite
```

---

## Tài Liệu Tham Khảo

- [Hướng Dẫn Triển Khai (Deployment Guide)](docs/DEPLOYMENT_GUIDE.md)
- [Tài Liệu RESTful API (API Documentation)](docs/API_DOCUMENTATION.md)
- [Thiết Kế Cơ Sở Dữ Liệu (Database Schema & ERD)](docs/DATABASE_SCHEMA.md)
