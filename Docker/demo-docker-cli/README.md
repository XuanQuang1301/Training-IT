# Demo Docker CLI (Nhiều Container Thủ Công)

Môi trường **Node.js App + PostgreSQL** chạy bằng các câu lệnh Docker CLI thủ công *(không dùng Docker Compose)*.

---

## 1. Lệnh Khởi Chạy

```
# 1. Tạo Network & Volume
docker network create demo-net
docker volume create pg-data

# 2. Chạy Database Container (PostgreSQL - Port 5433)
docker run -d --name demo-db --net demo-net -v pg-data:/var/lib/postgresql/data -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=demodb -p 5433:5432 postgres:16-alpine

# 3. Build Image & Chạy Backend Container (Port 8081)
docker build -t backend-app:v1 .
docker run -d --name backend-app --net demo-net -p 8081:3000 -e DATABASE_URL=postgres://postgres:postgres@demo-db:5432/demodb backend-app:v1
```

---

## 2. Kiểm Tra API (Curl Test)

```powershell
# Kiểm tra Healthcheck
curl http://localhost:8081/health

# Thêm ghi chú mới
curl -X POST http://localhost:8081/api/notes -H "Content-Type: application/json" -d "{\"content\": \"Học Docker CLI thành công!\"}"

# Lấy danh sách ghi chú
curl http://localhost:8081/api/notes
```

---

## 3. Xem Log & Dọn Dẹp

```powershell
# Xem log Backend
docker logs -f backend-app

# Dọn dẹp toàn bộ container, network & volume
docker stop backend-app demo-db
docker rm backend-app demo-db
docker network rm demo-net
docker volume rm pg-data
```
