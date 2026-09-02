# Hướng Dẫn Demo Docker Cho Người Mới Học (Node.js + PostgreSQL)

Dự án này được thiết kế đơn giản để minh họa các khái niệm cơ bản nhất của Docker: **Dockerfile**, **Image**, **Container**, và **Docker Compose**.

---

## 1. Khái Niệm Cốt Lõi (Mental Model)

| Khái niệm | Ví dụ đời thực | Trong Docker |
|---|---|---|
| **Dockerfile** | Công thức nấu ăn (Recipe) | File văn bản chứa các bước chỉ dẫn để dựng ứng dụng. |
| **Image** | Món ăn đóng hộp / Bản thiết kế | Bản đóng gói hoàn chỉnh (App code + Node.js + OS) ở trạng thái tĩnh. |
| **Container** | Đĩa thức ăn phục vụ người ăn / Căn nhà hoàn thiện | Một phiên bản đang chạy (running instance) từ Image. |
| **Docker Compose** | Nhạc trưởng (Conductor) | Công cụ điều phối nhiều Container (Backend + PostgreSQL Database) chạy cùng lúc. |

---

## 2. Giải Thích Từng File

### 📄 `Dockerfile`
```dockerfile
FROM node:20-alpine         # Lấy hệ điều hành Alpine nhẹ đã cài sẵn Node.js v20 làm gốc
WORKDIR /app                # Tạo và chuyển vào thư mục làm việc /app trong container
COPY package*.json ./       # Copy file khai báo thư viện trước (để tận dụng Build Cache)
RUN npm install             # Cài đặt thư viện (express, pg)
COPY . .                    # Copy toàn bộ code còn lại vào container
EXPOSE 3000                 # Khai báo port 3000 ứng dụng sẽ lắng nghe
CMD ["node", "server.js"]   # Lệnh mặc định chạy server khi container khởi động
```

> **Mẹo giảng dạy (Build Cache Layer):**
> Docker build theo từng layer. Việc `COPY package*.json` và `RUN npm install` trước giúp Docker không phải tải lại `npm install` mỗi khi bạn sửa code trong `server.js`!

---

### 📄 `docker-compose.yml`
```yaml
version: '3.8'

services:
  backend:                  # Tên service backend
    build: .                # Tự build Image từ Dockerfile ở thư mục hiện tại
    ports:
      - "8080:3000"         # Map port: Máy ngoài truy cập 8080 -> vào container port 3000
    environment:
      - DATABASE_URL=postgres://postgres:postgres@db:5432/demodb # Truyền connection string PostgreSQL
    depends_on:
      - db                  # Khởi động 'db' trước rồi mới khởi động 'backend'

  db:                       # Tên service database PostgreSQL
    image: postgres:16-alpine # Dùng sẵn Image PostgreSQL v16 official trên Docker Hub
    ports:
      - "5432:5432"         # Map port PostgreSQL ra ngoài máy host
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=demodb
    volumes:
      - postgres-data:/var/lib/postgresql/data # Gắn Named Volume để dữ liệu lưu trữ lâu dài

volumes:
  postgres-data:            # Khai báo volume lưu trữ dữ liệu bền vững
```

---

## 3. Các Lệnh Thực Hành (CLI Walkthrough)

### Bước 1: Build Docker Image từ Dockerfile
Lệnh này sẽ đọc `Dockerfile` và đóng gói thành Image có tên `demo-backend`:
```bash
docker build -t demo-backend .
```
- Kiểm tra danh sách Image đã build:
```bash
docker images
```

---

### Bước 2: Chạy Container Đơn Lẻ (`docker run`)
Chạy ứng dụng backend độc lập không có Database:
```bash
docker run -d -p 8080:3000 --name my-backend demo-backend
```
- Giải thích cờ (flags):
  - `-d`: Detached mode (chạy ngầm).
  - `-p 8080:3000`: Map port 8080 máy thật vào port 3000 của container.
  - `--name my-backend`: Đặt tên dễ nhớ cho container.

- Kiểm tra container đang chạy:
```bash
docker ps
```
- Kiểm tra log container:
```bash
docker logs my-backend
```
- Thử gọi endpoint không cần DB:
  - `http://localhost:8080/` (Trả về message + hostname container)
  - `http://localhost:8080/api/users` (Danh sách user giả lập)
  - `http://localhost:8080/health` (Health check status)

- Dừng và xóa container đơn lẻ:
```bash
docker stop my-backend
docker rm my-backend
```

---

### Bước 3: Chạy Cả Hệ Thống Bằng Docker Compose (`docker compose up`)
Chạy đồng thời cả **Backend** và **PostgreSQL**:
```bash
docker compose up -d
```
- Kiểm tra trạng thái các container:
```bash
docker compose ps
```
- Xem log toàn bộ hệ thống (hoặc từng service):
```bash
docker compose logs -f
```
- Kiểm tra dữ liệu PostgreSQL persistent:
  1. Gửi request lưu note mới vào PostgreSQL (POST):
     ```bash
     curl -X POST http://localhost:8080/api/notes -H "Content-Type: application/json" -d "{\"content\": \"Hoc Docker va PostgreSQL that la de!\"}"
     ```
  2. Lấy danh sách note đã lưu trong PostgreSQL (GET):
     ```bash
     curl http://localhost:8080/api/notes
     ```

- Dừng và hạ toàn bộ hệ thống:
```bash
docker compose down
```
- Muốn xóa sạch cả Volume dữ liệu:
```bash
docker compose down -v
```

---

## 4. Kịch Bản Minh Họa Khi Giảng Dạy (Demo Scenarios)

1. **Minh họa Container Isolation (Tính độc lập):**
   - Mở route `http://localhost:8080/` để học viên thấy `hostname` chính là ID của Container.
2. **Minh họa Docker Build Cache:**
   - Sửa 1 dòng text trong `server.js`, chạy lại `docker build -t demo-backend .`.
   - Chỉ cho học viên thấy bước `RUN npm install` hiển thị `CACHED` (build siêu nhanh).
3. **Minh họa Data Persistence (Lưu trữ bền vững):**
   - Tạo vài record bằng `POST /api/notes`.
   - Chạy `docker compose down`.
   - Chạy lại `docker compose up -d`, sau đó `GET /api/notes` -> Dữ liệu bảng `notes` trong PostgreSQL vẫn còn nguyên nhờ Named Volume `postgres-data`.
