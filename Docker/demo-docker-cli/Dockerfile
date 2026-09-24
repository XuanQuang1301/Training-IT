# Giai đoạn 1: Build & Cài đặt Dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Sao chép file cấu hình package để tận dụng Docker layer caching
COPY package*.json ./

# Cài đặt các gói phụ thuộc
RUN npm install --omit=dev

# Giai đoạn 2: Runtime Image (Tối ưu dung lượng nhỏ gọn)
FROM node:20-alpine AS runner

WORKDIR /app

# Thiết lập biến môi trường NODE_ENV
ENV NODE_ENV=production
ENV PORT=3000

# Sao chép node_modules từ giai đoạn builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./

# Khai báo cổng lắng nghe bên trong container
EXPOSE 3000

# Lệnh khởi chạy chính
CMD ["node", "server.js"]
