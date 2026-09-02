# 1. Dùng base image Node.js phiên bản 
FROM node:20-alpine

# 2. Thiết lập thư mục làm việc mặc định bên trong container
WORKDIR /app

# 3. Copy file package.json và package-lock.json vào container trước
COPY package*.json ./

# 4. Cài đặt các thư viện phụ thuộc khai báo trong package.json
RUN npm install

# 5. Copy toàn bộ mã nguồn còn lại của dự án vào thư mục /app trong container
COPY . .

# 6. Khai báo port 3000 mà container sẽ lắng nghe 
EXPOSE 3000

# 7. Lệnh mặc định sẽ chạy khi container được khởi chạy từ Image này
CMD ["node", "server.js"]
