# Hướng Dẫn Kiến Thức Docker & Docker Compose Căn Bản Đến Thực Chiến

---

## Mục Lục
- [Phần 1: Đặt Vấn Đề](#phần-1-đặt-vấn-đề)
  - [1.1. Vấn đề thực tế](#11-vấn-đề-thực-tế)
  - [1.2. Docker là gì](#12-docker-là-gì)
  - [1.3. So sánh Docker với Máy ảo (Virtual Machine)](#13-so-sánh-docker-với-máy-ảo-virtual-machine)
- [Phần 2: Các Khái Niệm Cốt Lõi](#phần-2-các-khái-niệm-cốt-lõi)
  - [2.1. DockerFile](#21-dockerfile)
  - [2.2. Image](#22-image)
  - [2.3. Container](#23-container)
  - [2.4. Vậy lúc nào cần có Dockerfile?](#24-vậy-lúc-nào-cần-có-dockerfile)
  - [2.5. Docker Volume](#25-docker-volume)
- [Phần 3: Vấn Đề Khi Có Nhiều Container](#phần-3-vấn-đề-khi-có-nhiều-container)
- [Phần 4: Docker Compose Là Gì?](#phần-4-docker-compose-là-gì)
  - [4.1. Cấu trúc 1 file docker-compose.yml mẫu trực quan](#41-cấu-trúc-1-file-docker-composeyml-mẫu-trực-quan)
  - [4.2. Bộ lệnh điều khiển Docker Compose cơ bản](#42-bộ-lệnh-điều-khiển-docker-compose-cơ-bản)
  - [4.3. Cơ chế Docker Network nội bộ & Case Study Spotify](#43-cơ-chế-docker-network-nội-bộ--case-study-spotify)
- [Phần 5: Lưu Ý Khi Sử Dụng Docker (u-ý-khi-sử-dụng-docker-best-practices)
  - [5.1. Luôn sử dụng file .dockerignore](#51-luôn-sử-dụng-file-dockerignore)
  - [5.2. Tối ưu kích thước Image](#52-tối-ưu-kích-thước-image)
  - [5.3. Vấn đề bảo mật & Quản lý thông tin nhạy cảm](#53-vấn-đề-bảo-mật--quản-lý-thông-tin-nhạy-cảm)
  - [5.4. Quản lý dọn dẹp dung lượng ổ đĩa](#54-quản-lý-dọn-dẹp-dung-lượng-ổ-đĩa)
  - [5.5. Lưu ý về Port Mapping và Kết nối mạng giữa các Container](#55-lưu-ý-về-port-mapping-và-kết-nối-mạng-giữa-các-container)
- [Phần 6: Thực Hành Chạy Multi-Container Thủ Công Bằng Docker CLI (Không Dùng Compose)](#phần-6-thực-hành-chạy-multi-container-thủ-công-bằng-docker-cli-không-dùng-compose)

---

## Phần 1: Đặt Vấn Đề

### 1.1. Vấn đề thực tế
Khi phát triển phần mềm theo cách truyền thống, các lập trình viên thường đối mặt với thách thức kinh điển **"Máy tôi chạy được - Máy anh không chạy được"**:
- **Xung đột phiên bản (Dependency Conflicts):** Máy của Dev A chạy Node 18, Dev B chạy Node 20, Server chạy Node 16 dẫn tới code không tương thích.
- **Thiếu sót thư viện & Cấu hình:** Quên cài gói phụ thuộc, thiếu biến môi trường (`Environment Variables`) hoặc cấu hình hệ điều hành ngầm.
- **Mất thời gian Onboarding:** Khi có thành viên mới vào dự án, thường mất từ 1 đến 2 ngày chỉ để cài đặt môi trường cơ sở dữ liệu, runtime, cache,...

### 1.2. Docker là gì?
> **Docker** là nền tảng mở cho phép đóng gói ứng dụng cùng tất cả các thành phần phụ thuộc (mã nguồn, runtime, công cụ hệ thống, thư viện) vào một đơn vị chuẩn hóa gọi là **Container**.

- **Khẩu hiệu cốt lõi:** *"Build once, run anywhere"* (Đóng gói một lần, chạy ở bất kỳ đâu).
- Chỉ cần **1 lệnh** `docker build` để đóng gói toàn bộ môi trường.
- **So sánh dễ hình dung:** Giống như đóng gói cả căn phòng (bàn ghế, đồ dùng) vào một chiếc thùng container tiêu chuẩn, mang đi đâu cũng lắp ráp và hoạt động y hệt.

### 1.3. So sánh Docker với Máy ảo (Virtual Machine)
Trước khi Docker ra đời, giải pháp phổ biến nhất để giải quyết vấn đề cô lập môi trường là sử dụng Máy ảo (Virtual Machine - VM) thông qua các Hypervisor (như VMware, VirtualBox).

Cả hai đều dùng để cô lập môi trường chạy ứng dụng, nhưng cách hoạt động hoàn toàn khác nhau:
- **Máy ảo (VM):** **Ảo hóa phần cứng**. Mỗi máy ảo phải cài trọn vẹn một hệ điều hành riêng (*Guest OS*), gánh thêm nhiều dịch vụ nền nên nặng nề (hàng GB) và tốn nhiều tài nguyên CPU/RAM.
- **Docker Container:** **Ảo hóa hệ điều hành**. Container không có OS riêng, nó chỉ là một tiến trình chạy độc lập và dùng chung nhân hệ điều hành (*Host Kernel*) của máy thật thông qua Docker Engine. Vì vậy Container khởi động siêu nhanh (vài mili-giây) và cực kỳ nhẹ (chỉ vài MB đến chục MB).

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
# Bước 1: Mượn một môi trường có sẵn Node.js 18 (bản siêu nhẹ alpine)
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
- **Read-only (Chỉ đọc):** Không ai sửa đổi trực tiếp vào Image được. Nó giống như một file nén `.zip` hoặc bản ISO đã đóng băng.
- **Chia sẻ dễ dàng:** Có thể đẩy lên mạng (Docker Hub / AWS ECR) để đồng nghiệp tải về chạy ngay mà không lo lỗi khác biệt hệ điều hành.

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
  - *Ví dụ:* Từ 1 Image `my-web-app:v1`, bạn có thể chạy 3 Container ở 3 cổng khác nhau: Cổng 3001, Cổng 3002, Cổng 3003 để chia tải (Load Balancing).

#### Đặc điểm lưu trữ:
- Khi Container dừng và bị xóa (`docker rm`), những gì phát sinh trong quá trình chạy sẽ **mất đi** (Writable Layer bị xóa), trừ khi bạn dùng **Docker Volume** để gắn ổ cứng ngoài vào.

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

#### So sánh Image khác Container ở chỗ nào?

| Tiêu chí | Image | Container |
| :--- | :--- | :--- |
| **Bản chất** | Bản thiết kế nhà / khuôn đúc tĩnh. Chứa mã nguồn, thư viện và cấu hình. | Thực thể sống động được bật lên từ Image. Có lớp ghi dữ liệu riêng (`Writable Layer`). |
| **Trạng thái** | Tĩnh, không tiêu tốn tiến trình hay CPU/RAM thực tế. | Đang chạy, tiêu tốn CPU, RAM và tài nguyên thực tế. |
| **Mối quan hệ** | 1 Image duy nhất có thể đúc ra... | ...rất nhiều Container chạy độc lập cùng lúc. |

---

### 2.4. Vậy lúc nào cần có Dockerfile?

#### 2.4.1. Các trường hợp CẦN có Dockerfile
1. **Khi muốn đóng gói mã nguồn của mình:**
   - *Tình huống:* Khi tự viết một ứng dụng Web Backend (Node.js, Spring Boot, Python,...) hoặc Frontend (ReactJS, Vue, HTML,...).
   - *Lý do cần:* Docker Hub không có sẵn mã nguồn logic nghiệp vụ của bạn. Cần `Dockerfile` để copy file code của mình vào, cài các thư viện đặc thù (`npm install`, `pip install`, `mvn package`) và cấu hình lệnh chạy (`node server.js`, `java -jar app.jar`).
2. **Khi cần tùy biến sâu 1 Image có sẵn:**
   - *Tình huống:* Muốn dùng nền tảng Linux (Ubuntu/Debian) hoặc Nginx/PHP, nhưng cần cài thêm công cụ phụ trợ (`curl`, `ffmpeg`, `imagemagick`, driver kết nối riêng) hoặc sửa đổi file cấu hình hệ thống mặc định (`nginx.conf`, `php.ini`).
   - *Lý do cần:* Dùng lệnh `FROM ubuntu` và viết tiếp các lệnh `RUN apt-get install ffmpeg` để tạo ra một bản Image riêng theo đúng yêu cầu dự án.
3. **Khi thiết lập quy trình tự động hóa CI/CD:**
   - *Tình huống:* Dự án cần tự động build bản cài đặt mỗi khi lập trình viên đẩy code lên GitHub/GitLab.
   - *Lý do cần:* Pipeline CI/CD sẽ đọc `Dockerfile` này để tự động build ra một Image mới và đẩy lên Docker Hub hoặc AWS ECR/Google Artifact Registry.

#### 2.4.2. Các trường hợp KHÔNG CẦN Dockerfile
Sử dụng các dịch vụ / phần mềm tiêu chuẩn có sẵn như:
- **Database:** PostgreSQL, MySQL, MongoDB, SQL Server.
- **Cache / Message Queue:** Redis, RabbitMQ, Kafka.
- **Web Server tĩnh / Reverse Proxy:** Nginx, Traefik.
- **Tools quản trị:** phpMyAdmin, Adminer, Elasticsearch.

*Tại sao không cần? Các nhà phát triển đã viết sẵn Dockerfile và build sẵn Image chuẩn đẩy lên Docker Hub. Bạn chỉ cần kéo về chạy trực tiếp bằng lệnh `docker run` hoặc khai báo thẻ `image:` trong `docker-compose.yml`.*

---

### 2.5. Docker Volume

#### 2.5.1. Tại sao cần Docker Volume?
- Khi tạo container cơ sở dữ liệu (như MySQL, PostgreSQL) và thêm dữ liệu vào, dữ liệu đó được ghi vào một lớp tạm thời (*Writable Layer*) bên trong container.
- Nếu tắt hoặc khởi động lại container: Dữ liệu vẫn còn.
- **Nhưng nếu bạn XÓA container (`docker rm` hoặc `docker compose down`):** Toàn bộ dữ liệu phát sinh sẽ bị **xóa sạch vĩnh viễn** theo container đó.
- **Giải pháp:** Docker Volume ra đời để tách biệt hoàn toàn **Vòng đời Dữ liệu** ra khỏi **Vòng đời của Container**.

#### 2.5.2. Cách Docker Volume hoạt động
1. **Volume** thực chất là một thư mục nằm trên máy thật (*Host Machine*), được Docker quản lý tại một vùng an toàn (thường là `/var/lib/docker/volumes/...`).
2. Khi ứng dụng trong Container ghi file vào `/var/lib/postgresql/data`, thực chất dữ liệu đang bay thẳng vào Volume ở máy thật.
3. Khi xóa container, Volume vẫn nằm nguyên trên máy thật.
4. Khi tạo một container mới (hoặc nâng cấp phiên bản database), chỉ cần gắn lại Volume cũ vào, dữ liệu lập tức quay trở lại đầy đủ.

---

## Phần 3: Vấn Đề Khi Có Nhiều Container

Một ứng dụng thực tế thường gồm nhiều thành phần phối hợp: `Frontend`, `Backend`, `Database`, `Cache`, `Message Queue`...

Nếu chạy tay từng lệnh `docker run` cho từng container sẽ nảy sinh các vấn đề nghiêm trọng:
1. **Dài dòng & Dễ sai sót:** Phải nhớ hàng chục tham số cờ truyền vào (`-p`, `-e`, `-v`, `--network`, `--name`).
2. **Vấn đề thứ tự khởi động (Startup Dependency):**
   - Backend cần Database khởi động hoàn tất mới kết nối được.
   - Nếu chạy tay, lập trình viên phải bật DB, ngồi chờ vài giây cho DB sẵn sàng rồi mới bật Backend.
   - Nếu bật Backend trước -> Backend crash ngay lập tức vì không tìm thấy cơ sở dữ liệu.
3. **Cấu hình mạng thủ công phức tạp:**
   - Mặc định các container độc lập không tự nói chuyện được với nhau qua tên miền (*Service Name*).
   - Lập trình viên phải tự gõ lệnh tạo bridge network riêng (`docker network create`), sau đó mỗi lệnh `docker run` lại phải gắn thêm flag `--network`, hoặc phải hardcode địa chỉ IP nội bộ của container (vốn thay đổi liên tục mỗi lần restart).

> **Lời kết:** Quản lý 1 container bằng `docker run` là một trải nghiệm tuyệt vời, nhưng quản lý 5–10 container bằng tay lại là một cơn ác mộng. Đó chính là lý do **Docker Compose** ra đời: biến toàn bộ chuỗi lệnh thủ công phức tạp thành một file cấu hình khai báo duy nhất.

---

## Phần 4: Docker Compose Là Gì?

**Docker Compose** là công cụ định nghĩa và chạy ứng dụng Docker đa container bằng một file khai báo YAML duy nhất (`docker-compose.yml`), giúp điều khiển toàn bộ hệ thống chỉ bằng **một lệnh đơn giản**.

### 4.1. Cấu trúc 1 file `docker-compose.yml` mẫu trực quan

```yaml
version: '3.8'

services:
  # Service 1: Application Backend (tự build từ mã nguồn)
  backend_api:
    build: ./backend        # Chỉ định thư mục chứa Dockerfile của backend
    ports:
      - "3000:3000"         # Ánh xạ cổng Host:Container
    environment:
      DB_HOST: database_service  # Kết nối sang DB bằng TÊN SERVICE!
      DB_PORT: 5432
      DB_PASSWORD: secretpassword
    depends_on:
      - database_service    # Đảm bảo DB khởi động trước Backend

  # Service 2: Cơ sở dữ liệu Postgres (dùng image có sẵn từ Docker Hub)
  database_service:
    image: postgres:15-alpine # Dùng thẳng image chuẩn, KHÔNG cần Dockerfile
    environment:
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data # Gắn volume lưu dữ liệu bền vững

volumes:
  postgres_data:            # Khai báo volume dùng chung
```

- `build` vs `image`: Dịch vụ nào lấy sẵn trên Docker Hub thì dùng `image:`, còn mã nguồn tự viết của team thì dùng `build: ./backend`.

---

### 4.2. Bộ lệnh điều khiển Docker Compose cơ bản

- `docker compose up -d`: Khởi chạy toàn bộ cụm dịch vụ ngầm trong nền (*Detached mode*).
- `docker compose ps`: Xem danh sách và trạng thái của các service đang chạy trong cụm.
- `docker compose logs -f`: Xem log thời gian thực của tất cả các dịch vụ (bấm `Ctrl + C` để thoát log).
- `docker compose down`: Dừng và gỡ bỏ toàn bộ container, network được tạo bởi Compose.
- `docker compose down -v`: Tắt cụm dịch vụ và **XÓA LUÔN Volume** (Reset toàn bộ dữ liệu về trạng thái ban đầu).

---

### 4.3. Cơ chế Docker Network nội bộ & Case Study Spotify

#### Cơ chế Mạng Nội Bộ
- Docker Compose tự động cấp phát một mạng cầu nối (*Bridge Network*) riêng và cơ chế **DNS nội bộ (Embedded DNS)**.
- Tất cả container trong cùng một file `docker-compose.yml` tự động tìm thấy và kết nối trực tiếp với nhau thông qua **Service Name** thay vì dùng IP động.

#### Ví dụ thực tế: Cách Docker giúp Spotify phục vụ hàng tỷ người dùng
Người dùng cuối không cần cài Docker trên điện thoại. Docker đóng vai trò là "vũ khí bí mật" ở tầng máy chủ (*Backend*) phía sau để xử lý lượng truy cập khổng lồ:
1. **Chia nhỏ tính năng (Microservices Architecture):** Spotify chia hệ thống thành hàng trăm dịch vụ độc lập (Tìm kiếm, Gợi ý bài hát, Thanh toán, Phát nhạc). Mỗi dịch vụ được đóng gói thành một Docker Image riêng biệt, lỗi ở một dịch vụ không làm sập toàn bộ ứng dụng.
2. **Nhân bản thần tốc khi nghẽn mạng (Auto-Scaling):** Khi có ca sĩ ra mắt album hot, lượng truy cập tăng vọt, hệ thống tự động nhân bản tính năng phát nhạc từ 50 container lên 5.000 container trong vài phút để chia tải, sau đó tự hủy bớt khi hết giờ cao điểm để tiết kiệm chi phí.
3. **Triển khai toàn cầu không sợ lệch môi trường:** Spotify đặt máy chủ ở khắp các châu lục (AWS, Google Cloud). Nhờ Docker, đội ngũ kỹ sư chỉ cần đưa một Image lên là chạy mượt mà trên mọi máy chủ mà không cần cấu hình lại hệ điều hành hay thư viện.
4. **Cập nhật không gián đoạn (Zero-Downtime Deployment):** Khi nâng cấp phiên bản mới, Docker bật các container mới song song rồi mới tắt container cũ. Người dùng nghe nhạc liên tục mà không bao giờ gặp thông báo "hệ thống đang bảo trì".

---

## Phần 5: Lưu Ý Khi Sử Dụng Docker (s)

### 5.1. Luôn sử dụng file `.dockerignore`
- **Vấn đề:** Khi dùng lệnh `COPY . .` trong Dockerfile, Docker sẽ sao chép toàn bộ thư mục hiện tại vào Image, bao gồm cả các thư mục nặng hàng trăm MB như `node_modules/`, `.git/`, `.env`, file log hay các bản build tạm (`dist/`, `build/`).
- **Hậu quả:** Làm dung lượng Image phình to bất thường, tốn dung lượng lưu trữ và mất nhiều thời gian build/đẩy lên registry.
- **Giải pháp:** Tạo file `.dockerignore` cùng cấp với Dockerfile để loại trừ các file/thư mục không cần thiết:
  ```dockerignore
  node_modules
  .git
  .env
  dist
  build
  *.log
  ```

---

### 5.2. Tối ưu kích thước Image
1. **Ưu tiên Base Image bản nhẹ (Minimal Base Images):**
   - Thay vì dùng các bản đầy đủ như `node:18` (nặng ~1GB) hay `ubuntu` (~80MB), hãy ưu tiên các bản rút gọn như `node:18-alpine` hoặc `python:3.11-slim` (chỉ khoảng 50–150MB).
2. **Tận dụng Multi-stage Build:**
   - Chia quá trình build thành 2 giai đoạn:
     - **Stage 1 (Build):** Dùng một container tạm thời đầy đủ công cụ để compile mã nguồn (cài NPM, Maven, C++ compiler).
     - **Stage 2 (Runner):** Chỉ chép file sản phẩm đã hoàn thiện (`.jar`, file HTML/JS đã bundle) sang một container siêu nhẹ để chạy thực tế, giúp loại bỏ hoàn toàn các bộ biên dịch và thư viện rác.

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### 5.3. Vấn đề bảo mật & Quản lý thông tin nhạy cảm
- **Không lưu cứng mật khẩu, Secret Key, API Key vào Dockerfile hoặc Code:**
  - Docker Image có thể được chia sẻ công khai lên Docker Hub. Bất kỳ ai tải Image về cũng có thể dùng lệnh `docker history` để xem lại tất cả các layer và lấy được thông tin nhạy cảm.
- **Giải pháp:** Truyền thông tin nhạy cảm thông qua **Biến môi trường (Environment Variables)** trong file `.env` hoặc cấu hình qua thẻ `environment:` trong `docker-compose.yml`.

---

### 5.4. Quản lý dọn dẹp dung lượng ổ đĩa
- **Vấn đề:** Sau một thời gian làm việc, Docker sẽ tích tụ rất nhiều Image cũ không dùng (*Dangling images*), container đã tắt và build cache, có thể chiếm tới hàng chục GB ổ cứng.
- **Các lệnh dọn dẹp cần nhớ:**
  - `docker system df`: Kiểm tra xem Docker đang chiếm bao nhiêu dung lượng ổ đĩa.
  - `docker system prune`: Dọn dẹp tất cả container đã tắt, network thừa và dangling images.
  - `docker system prune -a --volumes`: Dọn dẹp triệt để toàn bộ hệ thống (dừng toàn bộ, xóa sạch cache, image không dùng và volume).

---

### 5.5. Lưu ý về Port Mapping và Kết nối mạng giữa các Container

#### 1. Xung đột Port trên máy thật
Nếu cổng `3306` (MySQL) hoặc `8080` đã có một dịch vụ khác trên máy thật đang sử dụng, bạn bắt buộc phải đổi cổng bên ngoài máy thật theo cú pháp:
`-p [Cổng_Máy_Thật]:[Cổng_Trong_Container]` (Ví dụ: `-p 3307:3306`).

#### 2. Hiểu đúng về `localhost` bên trong Docker Container & Ẩn dụ Phòng Trọ

##### Ví dụ Ẩn dụ Căn Phòng Trọ:
- **Máy tính thật (Host Machine):** Là một khu trọ lớn.
- **Container Backend:** Là Phòng số 101.
- **Container Database (Postgres/MySQL):** Là Phòng số 102.

Trong mạng máy tính, từ khóa `localhost` (hoặc IP `127.0.0.1`) có nghĩa là: **"Chính tôi / Ngay tại căn phòng này"**.

- Khi bạn đứng ở máy thật gõ `localhost:5432`, máy tính hiểu là *"kết nối tới cổng 5432 của máy tính này"*.
- Nhưng khi code Backend đang chạy **bên trong Phòng 101 (Container Backend)**:
  - Nếu cấu hình `DB_HOST=localhost`, Backend sẽ tự nói: *"Hãy tìm Database ngay bên trong chính căn phòng 101 này!"*.
  - Nhưng trong phòng 101 chỉ có mỗi code Backend, không hề có Database -> Báo lỗi lập tức: `Connection refused` hoặc `ECONNREFUSED 127.0.0.1:5432`.

##### Docker Compose giải quyết việc này như thế nào?
Khi dùng Docker Compose, Docker sẽ tự động tạo ra một **Mạng ảo riêng (Default Bridge Network)** và cung cấp một hệ thống DNS nội bộ.

Nó hoạt động giống như một **Danh bạ điện thoại**: Tên của mỗi dịch vụ (*service name*) đặt trong file `docker-compose.yml` chính là tên định danh (*Hostname*) của container đó trong mạng nội bộ.

##### Minh họa trực tiếp qua file `docker-compose.yml`:

```yaml
version: '3.8'
services:
  # Tên service thứ nhất là: "backend_api"
  backend_api:
    build: .
    ports:
      - "3000:3000"
    environment:
      # SAI: Sẽ lỗi không kết nối được Database vì localhost chỉ trỏ vào chính container này!
      # DB_HOST: localhost 
      
      # ĐÚNG: Điền chính xác TÊN SERVICE của container Database phía dưới
      DB_HOST: database_service 
      DB_PORT: 5432

  # Tên service thứ hai là: "database_service"
  database_service:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secretpassword
```

---
## Phần 6: Thực Hành Chạy Multi-Container Thủ Công Bằng Docker CLI (Không Dùng Compose)

Để hiểu rõ bản chất những gì Docker Compose thực hiện tự động bên dưới, dưới đây là quy trình để kết nối và vận hành hệ thống Multi-Container thủ công 100% bằng các lệnh `docker` CLI.

> 📁 Mã nguồn thực hành chi tiết nằm tại thư mục [demo-docker-cli](file:///d:/Nexis/Training/Docker/demo-docker-cli).

### Sơ đồ luồng kết nối thủ công bằng CLI:

```text
[ Máy Thật (Host Machine) ] ──► Port 8080:3000 ──► [ backend-app Container ]
                                                        │ (DNS: demo-db:5432)
                                                        ▼
                                                  [ demo-db Container ] (postgres:16-alpine)
                                                        │
                                                        ▼ (mount)
                                                  [ Volume: pg-data ]
```

### Bộ lệnh chạy trên Windows (PowerShell - 1 Dòng):

```powershell
# 1. Tạo Network & Volume
docker network create demo-net
docker volume create pg-data

# 2. Chạy PostgreSQL Container
docker run -d --name demo-db --net demo-net -v pg-data:/var/lib/postgresql/data -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=demodb -p 5432:5432 postgres:16-alpine

# 3. Build & Chạy Backend Container
cd demo-docker-cli
docker build -t backend-app:v1 .
docker run -d --name backend-app --net demo-net -p 8080:3000 -e DATABASE_URL=postgres://postgres:postgres@demo-db:5432/demodb backend-app:v1

# 4. Kiểm tra API
curl http://localhost:8080/health
curl -X POST http://localhost:8080/api/notes -H "Content-Type: application/json" -d "{\"content\": \"Học Docker CLI thành công!\"}"
curl http://localhost:8080/api/notes

# 5. Dọn dẹp môi trường khi xong
docker stop backend-app demo-db
docker rm backend-app demo-db
docker network rm demo-net
docker volume rm pg-data
```



