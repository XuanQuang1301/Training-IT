# KHUNG NỘI DUNG: GIT - BẢN CHẤT VÀ KIẾN TRÚC MÃ NGUỒN

## I. Đặt vấn đề
* **Quản lý thủ công và rủi ro:** Đặt tên thư mục hoặc tệp theo cách truyền thống (`bản 1`, `bản cuối`, `đã sửa lỗi`) $\rightarrow$ Mất khả năng truy vết xem ai đã sửa nội dung gì, vào lúc nào và vì lý do gì.
* **Xung đột khi làm việc nhóm:** Gửi mã nguồn qua ứng dụng nhắn tin, nén tệp hoặc tải lên máy chủ dùng chung $\rightarrow$ Dễ bị ghi đè gây mất dữ liệu và tốn nhiều công sức để hợp nhất lại.

---

## II. Giải pháp và Triết lý thiết kế
* **Mô hình Phân tán và Tập trung:** Sự khác biệt cốt lõi giữa Git và các hệ thống cũ như SVN (Kho lưu trữ cá nhân giữ toàn bộ lịch sử so với việc phụ thuộc hoàn toàn vào máy chủ trung tâm).
* **Tư tưởng lưu trữ dữ liệu:** Sự khác biệt giữa việc lưu trữ các dòng thay đổi vi mô và việc chụp lại toàn bộ bức ảnh trạng thái hệ thống tại từng thời điểm.

---

## III. Kiến trúc cốt lõi (Phần trọng tâm)


* **Ba vùng làm việc:** Thư mục làm việc thực tế $\rightarrow$ Vùng đệm chuẩn bị $\rightarrow$ Kho lưu trữ chính thức.
* **Bốn đối tượng dữ liệu cốt lõi:**
  * Khối dữ liệu: Lưu nội dung tệp.
  * Cây thư mục: Lưu cấu trúc thư mục và tên tệp.
  * Điểm lưu trữ: Lưu bức ảnh trạng thái dự án kèm thông tin người sửa.
  * Thẻ đánh dấu: Đánh dấu các mốc quan trọng.
* **Cấu trúc đồ thị hướng không chu trình:** Lịch sử được sắp xếp theo dạng đồ thị nối tiếp nhau, mã hóa và bảo vệ tính toàn vẹn của dữ liệu bằng thuật toán chuỗi băm.

---

## IV. Giải mã bản chất các thao tác
* **Khởi tạo và sao chép:** Bản chất của việc tạo thư mục ẩn lưu trữ cấu trúc và việc nhân bản toàn bộ đồ thị lịch sử từ xa về máy cá nhân.
* **Quản lý thay đổi:** Bản chất của việc đưa tệp vào vùng đệm, đóng gói bức ảnh trạng thái và tạm cất giữ công việc đang làm dở.
* **Làm việc với nhánh:** Bản chất của nhánh thực chất chỉ là một con trỏ siêu nhẹ; so sánh sự khác nhau giữa việc gộp nhánh thông thường (tạo điểm lưu trữ mới) và việc đặt lại gốc lịch sử (làm phẳng chuỗi lịch sử).
* **Đồng bộ từ xa:** Cơ chế trao đổi các con trỏ và dữ liệu điểm lưu trữ giữa máy cá nhân và máy chủ lưu trữ dùng chung.

---

## V. Đánh giá, So sánh và Quy tắc sử dụng
* **So sánh các hệ thống tương tự:** Git so với SVN và Perforce (về tốc độ, mô hình hoạt động và khả năng xử lý các tệp có dung lượng lớn).
* **Ưu điểm và Nhược điểm:** Tốc độ xử lý cực nhanh, thao tác nhánh nhẹ nhàng nhưng có độ dốc cao về mặt thời gian tiếp thu đối với người mới.
* **Quy tắc làm việc chuẩn:** Chia nhỏ các lần lưu trữ, viết ghi chú rõ ràng và tuân thủ đúng quy trình làm việc chung của nhóm.
