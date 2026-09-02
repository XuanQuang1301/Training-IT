# Hướng Dẫn Kiến Thức Docker Căn Bản & Cốt Lõi

---

## Phần 1: Đặt Vấn Đề

### 1.1. Vấn đề thực tế trong phát triển phần mềm truyền thống
Khi phát triển phần mềm theo cách truyền thống, các lập trình viên thường đối mặt với các thách thức:
- **Xung đột phiên bản (Dependency Conflicts):** Máy của Dev A chạy Node 18, Dev B chạy Node 20, Server chạy Node 16 dẫn tới code không tương thích.
- **Thiếu sót thư viện & Cấu hình:** Quên cài gói phụ thuộc, thiếu biến môi trường (`Environment Variables`) hoặc cấu hình hệ điều hành ngầm.
- **Mất thời gian Onboarding:** Khi có thành viên mới vào dự án, thường mất từ 1 đến 2 ngày chỉ để cài đặt môi trường cơ sở dữ liệu, runtime, cache,...

### 1.2. Docker là gì?
> **Docker** là nền tảng mở cho phép đóng gói ứng dụng cùng tất cả các thành phần phụ thuộc (mã nguồn, runtime, công cụ hệ thống, thư viện) vào một đơn vị chuẩn hóa gọi là **Container**.

- **Khẩu hiệu cốt lõi:** *"Build once, run anywhere"* (Đóng gói một lần, chạy ở bất kỳ đâu).
- **So sánh dễ hình dung:** Giống như đóng gói cả căn phòng (bàn ghế, đồ dùng) vào một chiếc thùng container tiêu chuẩn, mang đi đâu cũng lắp ráp và hoạt động y hệt.

---

## Phần 2: Các Khái Niệm Cốt Lõi

### 2.1. DockerFile

#### Dùng để làm gì?
- Là một file văn bản thuần túy (`text file`).
- Dùng để hướng dẫn Docker tự động dựng môi trường từng bước một mà không cần con người ngồi gõ từng lệnh một trên terminal.

#### Cấu trúc các lệnh cơ bản:
- `FROM`: Chọn hệ điều hành hoặc môi trường nền tảng (*Base image* như Node, Java, Python, Ubuntu,...).
- `WORKDIR`: Tạo và chuyển đến thư mục làm việc bên trong container.
- `COPY`: Chép file từ máy thật (*Host*) vào bên trong container.
- `RUN`: Chạy các lệnh cài đặt thư viện/gói phụ thuộc (như `npm install`, `apt-get install`,...).
- `EXPOSE`: Khai báo cổng (*Port*) mà ứng dụng sẽ lắng nghe.
- `CMD`: Lệnh chính để khởi động ứng dụng khi container bắt đầu chạy.

#### Ví dụ Dockerfile mẫu:
```dockerfile
# Bước 1: Mượn một môi trường có sẵn Node.js 18
FROM node:18-alpine

# Bước 2: Tạo thư mục /app trong container để chứa code
WORKDIR /app

# Bước 3: Copy file khai báo thư viện và tải thư viện về
COPY package*.json ./
RUN npm install

# Bước 4: Copy toàn bộ code từ máy thật vào thư mục /app
COPY . .

# Bước 5: Ứng dụng sẽ chạy ở cổng 3000
EXPOSE 3000

# Bước 6: Khi bật container lên thì gõ lệnh gì để chạy app?
CMD ["node", "server.js"]
```

---

### 2.2. Image

#### Dùng để làm gì?
- Là sản phẩm được tạo ra sau khi Docker đọc và thực thi xong toàn bộ `Dockerfile`.
- Chứa toàn bộ mọi thứ cần để chạy app: mã nguồn, thư viện, runtime (Node/Java/Python), công cụ hệ thống.

#### Đặc điểm quan trọng:
- **Read-only (Chỉ đọc):** Không ai sửa đổi trực tiếp vào Image được. Nó giống như một file nén `.zip` đã đóng băng.
- **Chia sẻ dễ dàng:** Có thể đẩy lên mạng (Docker Hub) để đồng nghiệp tải về chạy ngay mà không lo lỗi khác biệt hệ điều hành.

#### Cách sử dụng cơ bản:
- **Tạo Image từ Dockerfile (Build):**
  ```bash
  docker build -t my-web-app:v1 .
  ```
- **Xem danh sách các Image trên máy:**
  ```bash
  docker images
  ```
- **Xóa một image không dùng:**
  ```bash
  docker rmi my-web-app:v1
  ```

---

### 2.3. Container

#### Dùng để làm gì?
- **Container** là một thực thể đang chạy (*running instance*) được tạo ra từ `Image`.
- Container là một môi trường cách ly hoàn toàn: Có CPU riêng, RAM riêng, ổ đĩa riêng và mạng riêng.
- Từ **1 Image duy nhất** -> Có thể bật ra **10 hay 1000 Container** cùng lúc.
  - *Ví dụ:* Từ 1 Image `my-web-app:v1`, bạn có thể chạy 3 Container ở 3 cổng khác nhau: Cổng 3001, Cổng 3002, Cổng 3003 để chia tải.

#### Đặc điểm lưu trữ:
- Khi Container dừng và bị xóa (`docker rm`), những gì phát sinh trong quá trình chạy sẽ **mất đi** (trừ khi bạn dùng **Docker Volume** để gắn ổ cứng ngoài vào).

#### Cách sử dụng cơ bản:
- **Chạy Image thành Container:**
  ```bash
  docker run -d -p 8080:3000 --name my-running-app my-web-app:v1
  ```
  - `-d` (*Detach*): Chạy ngầm trong nền, không chiếm màn hình Terminal.
  - `-p 8080:3000` (*Port mapping*): Chuyển tiếp cổng. Người dùng truy cập máy thật qua cổng `8080` sẽ được Docker chuyển vào cổng `3000` bên trong container.
  - `--name`: Đặt tên dễ nhớ cho container.
- **Xem các Container đang chạy:**
  ```bash
  docker ps
  ```
- **Xem tất cả Container (kể cả đã dừng):**
  ```bash
  docker ps -a
  ```
- **Dừng, khởi động lại và xóa Container:**
  ```bash
  docker stop my-running-app    # Dừng container
  docker start my-running-app   # Bật lại container
  docker rm my-running-app      # Xóa container
  ```

---

### 2.4. Vậy lúc nào cần có Dockerfile?

#### 2.4.1. Các trường hợp cần có Dockerfile
1. **Khi muốn đóng gói mã nguồn của mình:**
   - *Tình huống:* Khi tự viết một ứng dụng Web Backend (Node.js, Spring Boot, Python,...) hoặc Frontend (ReactJS, Vue, HTML,...).
   - *Lý do cần:* Docker Hub không có sẵn mã nguồn logic nghiệp vụ của bạn. Cần `Dockerfile` để copy file code của mình vào, cài các thư viện đặc thù (`npm install`, `pip install`, `mvn package`) và cấu hình lệnh chạy (`node server.js`, `java -jar app.jar`).
2. **Khi cần tùy biến sâu 1 Image có sẵn:**
   - *Tình huống:* Muốn dùng nền tảng Linux (Ubuntu/Debian) hoặc Nginx/PHP, nhưng cần cài thêm các công cụ phụ trợ (`curl`, `ffmpeg`, `imagemagick`, driver kết nối riêng) hoặc sửa đổi các file cấu hình hệ thống mặc định (`nginx.conf`, `php.ini`).
   - *Lý do cần:* Dùng lệnh `FROM ubuntu` và viết tiếp các lệnh `RUN apt-get install ffmpeg` để tạo ra một bản Image riêng theo đúng yêu cầu dự án.
3. **Khi thiết lập quy trình tự động hóa CI/CD:**
   - *Tình huống:* Dự án cần tự động build bản cài đặt mỗi khi lập trình viên đẩy code lên GitHub/GitLab.
   - *Lý do cần:* Pipeline CI/CD sẽ đọc `Dockerfile` này để tự động build ra một Image mới và đẩy lên Docker Hub hoặc AWS ECR/Google Artifact Registry.

#### 2.4.2. Các trường hợp không cần Dockerfile
Sử dụng các dịch vụ / phần mềm có sẵn như:
- **Database:** PostgreSQL, MySQL, MongoDB, SQL Server.
- **Cache / Message Queue:** Redis, RabbitMQ, Kafka.
- **Web Server tĩnh / Proxy:** Nginx, Traefik.
- **Tools:** phpMyAdmin, Adminer, Elasticsearch.

*Tại sao không cần? Các nhà phát triển đã viết sẵn Dockerfile và build sẵn Image lên Docker Hub. Bạn chỉ cần kéo về chạy trực tiếp bằng lệnh `docker run` hoặc khai báo thẻ `image:` trong `docker-compose.yml`.*

---

### 2.5. Docker Volume

#### Tại sao cần Docker Volume?
- Khi tạo container cơ sở dữ liệu (như MySQL, PostgreSQL) và thêm dữ liệu vào, dữ liệu đó được ghi vào một lớp tạm thời (*Writable Layer*) bên trong container.
- Nếu tắt hoặc khởi động lại container: Dữ liệu vẫn còn.
- **Nhưng nếu bạn XÓA container (`docker rm` hoặc `docker compose down`):** Toàn bộ dữ liệu sẽ bị **xóa sạch vĩnh viễn** theo container đó.
- Giải pháp: Docker Volume ra đời để tách biệt hoàn toàn **Dữ liệu** ra khỏi **Vòng đời của Container**.

#### Cách Docker Volume hoạt động:
1. **Volume** thực chất là một thư mục nằm trên máy thật (*Host Machine*), được Docker quản lý tại một vùng an toàn (thường là `/var/lib/docker/volumes/...`).
2. Khi ứng dụng trong Container ghi file vào `/var/lib/postgresql/data`, thực chất dữ liệu đang bay thẳng vào Volume ở máy thật.
3. Khi xóa container, Volume vẫn nằm nguyên trên máy thật.
4. Khi tạo một container mới (hoặc nâng cấp phiên bản database), chỉ cần gắn lại Volume cũ vào, dữ liệu lập tức quay trở lại đầy đủ.

---

## Phần 3: Vấn Đề Khi Có Nhiều Container

- Một ứng dụng thực tế thường có nhiều thành phần: `Backend`, `Database`, `Frontend`, `Cache`,...
- Nếu chạy tay từng `docker run` cho mỗi container -> Rất dài dòng, khó nhớ, khó quản lý kết nối giữa chúng.

---

## Phần 4: Docker Compose Là Gì?

**Docker Compose** là công cụ định nghĩa nhiều container liên quan nhau trong một file YAML duy nhất (`docker-compose.yml`), rồi chạy tất cả bằng **một lệnh**.

Giải quyết: Khai báo `service`, `network`, `volume`, biến môi trường ở một chỗ tập trung.

### 4.1. Cấu trúc 1 file `docker-compose.yml` mẫu trực quan
Một file `docker-compose.yml` gồm các phần cơ bản:
- `version`: Phiên bản cú pháp Compose.
- `services`: Danh sách các dịch vụ/container cần chạy.
- `ports`: Cấu hình ánh xạ cổng.
- `environment`: Cấu hình biến môi trường.
- `volumes`: Cấu hình lưu trữ dữ liệu bền vững.
- `networks`: Cấu hình mạng kết nối giữa các container.

### 4.2. Bộ lệnh điều khiển Docker Compose cơ bản
- `docker compose up -d`: Khởi chạy toàn bộ cụm dịch vụ ngầm trong nền.
- `docker compose ps`: Xem trạng thái các service.
- `docker compose logs -f`: Xem log thời gian thực của các dịch vụ.
- `docker compose down`: Tắt toàn bộ cụm dịch vụ.
- `docker compose down -v`: Tắt và **xóa luôn cả Volume** (Reset toàn bộ dữ liệu).

### 4.3. Cơ chế Docker Network nội bộ
- Các container trong cùng Compose tự động kết nối chung một mạng nội bộ.
- Có thể gọi nhau bằng **Tên Service** (Ví dụ: Backend gọi sang Database qua `host: database` thay vì dùng IP hay `localhost`).
