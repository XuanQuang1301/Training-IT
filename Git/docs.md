# Tài Liệu: Đặt Vấn Đề, Giải Pháp và Kiến Trúc Cốt Lõi Của Git

## 1. Đặt vấn đề

### 1.1. Quản lý thủ công - Nỗi đau trước khi có Git

Trước khi có hệ thống quản lý phiên bản (VCS), lập trình viên thường lưu code bằng cách:

```text
BaoCaoCuoiKy.docx
BaoCaoCuoiKy_v2.docx
BaoCaoCuoiKy_v2_sua.docx
BaoCaoCuoiKy_FINAL.docx
BaoCaoCuoiKy_FINAL_that.docx
BaoCaoCuoiKy_FINAL_gui_thay.docx
```

#### Vấn đề phát sinh

| Vấn đề | Hậu quả |
| :--- | :--- |
| Không biết bản nào là bản mới nhất, đúng nhất | Mất thời gian dò lại, dễ nộp nhầm bản cũ |
| Không có lịch sử thay đổi | Không biết ai sửa gì, sửa khi nào, tại sao sửa |
| Không thể quay lại bản cũ khi code mới bị lỗi | Phải nhớ hoặc gõ lại bằng tay |
| Backup thủ công (copy-paste thư mục) | Tốn dung lượng, dễ quên backup, dễ ghi đè nhầm |
| Không tách biệt được "code đang thử nghiệm" và "code chạy ổn định" | Một lỗi nhỏ có thể làm hỏng toàn bộ dự án |

Đây chính là động lực ra đời của VCS - con người cần có một “Cỗ máy thời gian” cho code, tự động ghi lại từng thay đổi mà không cần đặt tên file thủ công.

---

### 1.2. Xung đột nhóm - Nỗi đau khi làm việc tập thể

Khi nhiều người cùng sửa một dự án mà không có công cụ quản lý phiên bản phù hợp:

- **Ghi đè lẫn nhau:** A và B cùng sửa file `main.py` qua email/zalo ai gửi sau đè lên người gửi trước => mất code của người kia.
- **Không biết ai đang làm phần nào:** Hai người vô tình cùng sửa một chức năng, code trùng lặp hoặc mâu thuẫn.
- **Merge thủ công cực kì khó:** Copy - paste tay cho từng đoạn code khác nhau giữa hai bản rất dễ sót hoặc sai.
- **Không có “vùng đệm” an toàn:** Một người code lỗi có thể làm sập môi trường làm việc chung của cả nhóm.

=> Cần một hệ thống lưu lịch sử thay đổi minh bạch vừa hỗ trợ nhiều người làm việc song song mà không giẫm chân nhau. Đó là lý do Git ra đời.

---

## 2. Giải pháp

### 2.1. Phân tán (DVCS) và tập trung (CVCS)

- **CVCS — Centralized Version Control System (VD: SVN, Perforce):**
  - Chỉ server trung tâm giữ toàn bộ lịch sử.
  - Máy cá nhân chỉ có bản mới nhất (working copy).
  - Mọi thao tác commit, xem lịch sử đều cần kết nối mạng tới server.
  - Nếu server sập → không ai làm việc được, và nếu mất dữ liệu server → mất luôn lịch sử.

- **DVCS — Distributed Version Control System (VD: Git, Mercurial):**
  - Mỗi máy đều có bản sao đầy đủ (full copy) của toàn bộ lịch sử dự án, không riêng gì bản mới nhất.
  - Có thể commit, xem log, tạo nhánh... hoàn toàn offline, chỉ cần mạng khi đồng bộ (push/pull) với server.
  - Server (GitHub, GitLab...) đóng vai trò là nơi đồng bộ chung, không phải "chủ sở hữu duy nhất" của dữ liệu.
  - An toàn hơn: server sập, dữ liệu vẫn còn nguyên trên máy mọi người.

#### Bảng so sánh

| Tiêu chí | CVCS (SVN) | DVCS (Git) |
| :--- | :--- | :--- |
| Nơi lưu lịch sử | Chỉ ở server | Ở mọi máy |
| Làm việc offline | Không | Có |
| Tốc độ commit/log | Chậm (qua mạng) | Nhanh (cục bộ) |
| Rủi ro mất dữ liệu | Cao nếu server hỏng | Thấp (nhiều bản sao) |
| Độ phức tạp branching | Nặng nề | Nhẹ, nhanh |

---

### 2.2. Tư duy lưu trữ Data

- **Cách nghĩ SAI:** Git lưu từng "thay đổi" (diff) giữa các phiên bản, giống như các hệ thống khác - ví dụ commit chỉ ghi "dòng 5 sửa từ A thành B".
- **Cách Git thực sự hoạt động:** Mỗi lần commit, Git chụp lại toàn bộ ảnh chụp trạng thái của tất cả file tại thời điểm đó - giống như chụp ảnh cả bàn làm việc, không phải chỉ ghi "đã di chuyển cây bút".

**Để tiết kiệm dung lượng, Git thông minh ở chỗ:**
- File nào không đổi giữa 2 commit → Git chỉ lưu một liên kết trỏ tới file cũ đã lưu trước đó, không lưu lại lần nữa.
- File nào có đổi → Git lưu snapshot mới của riêng file đó.

---

## 3. Kiến trúc cốt lõi

### 3.1. Ba vùng dữ liệu

| Vùng | Vai trò | Lệnh liên quan |
| :--- | :--- | :--- |
| Working Directory | Nơi bạn thực sự gõ code, sửa file, giống như "mặt bàn làm việc" | `git status` để xem có gì thay đổi |
| Staging Area (Index) | Vùng đệm trung gian — bạn "chọn lọc" phần nào sẽ đưa vào commit tiếp theo | `git add` |
| Repository (.git) | Kho lưu trữ vĩnh viễn, chứa toàn bộ lịch sử commit | `git commit` |

---

### 3.2. Bốn đối tượng cốt lõi trong `.git/objects`

| Đối tượng | Vai trò | Ví dụ dễ hình dung |
| :--- | :--- | :--- |
| Blob (Binary Large Object) | Lưu nội dung của 1 file (chỉ nội dung, không lưu tên file) | Trang giấy chứa chữ, không ghi tiêu đề |
| Tree | Lưu cấu trúc thư mục — danh sách tên file/thư mục và con trỏ tới blob/tree tương ứng | Mục lục ghi "trang giấy nào tên gì, nằm ở đâu" |
| Commit | Một "ảnh chụp" hoàn chỉnh: trỏ tới 1 tree gốc, kèm tác giả, thời gian, message, và trỏ tới commit cha (parent) | Tấm ảnh chụp toàn cảnh + ghi chú ai chụp, khi nào |
| Tag | Đặt tên cố định, dễ nhớ cho một commit cụ thể (thường dùng đánh dấu version release) | Nhãn dán "v1.0.0" lên một tấm ảnh cụ thể |

#### Sơ đồ quan hệ:

```text
Commit ──Tree (thư mục gốc)
              ├── Blob (file README.md)
              ├── Tree (thư mục src/)
              │       ├── Blob (file main.py)
              │       └── Blob (file utils.py)
              └── Blob (file .gitignore)
```

---

### 3.3. HEAD là gì?

HEAD là một con trỏ đặc biệt, luôn chỉ tới commit (hoặc branch) mà bạn đang làm việc tại đó.

- **Ví dụ dễ hình dung:** nếu commit là các tấm ảnh chụp nằm trên một cuộn phim, thì HEAD chính là ngón tay bạn đang chỉ vào tấm ảnh nào trên cuộn phim đó.
- Bình thường, HEAD trỏ tới một branch (VD: `main`), và branch đó lại trỏ tới commit mới nhất.
- Khi bạn `git checkout <commit-hash>` (không phải tên branch), HEAD sẽ trỏ thẳng vào 1 commit cụ thể → trạng thái gọi là "detached HEAD" (HEAD bị "tách" khỏi mọi branch), commit mới tạo lúc này dễ bị mất nếu không tạo branch mới để giữ lại.
- Lệnh `git switch <ten>` hoặc `git checkout <ten>` thực chất là di chuyển HEAD sang trỏ vào branch khác.

---

### 3.4. Cấu trúc DAG

Lịch sử commit của Git không phải một đường thẳng mà là một đồ thị có hướng, không có chu trình (Directed Acyclic Graph):

- **Có hướng:** Mỗi commit chỉ trỏ về commit cha (commit trước nó), không trỏ tới tương lai.
- **Không chu trình:** Không thể đi vòng lại chính nó (không có commit nào là "cha của chính tổ tiên nó").
- Một commit thường có 1 cha (bình thường), nhưng merge commit có 2 cha trở lên.
- Chính cấu trúc DAG này giúp Git hỗ trợ branching (phân nhánh) và merge (hợp nhất) cực kỳ linh hoạt - vì về bản chất, nhánh (branch) chỉ là một con trỏ nhẹ (pointer) trỏ tới 1 commit cụ thể trong đồ thị này, không phải một bản sao dữ liệu.

---

## 4. Giải mã bản chất và thao tác

### 4.1. Khởi tạo và sao chép (init/clone)

- `git init`: Biến một thư mục thường thành một Git repository.
- `git clone`: Sao chép toàn bộ một repository đã tồn tại (kèm toàn bộ lịch sử) từ nơi khác (thường là GitHub) về máy.

---

### 4.2. Quản lý thay đổi (add/commit/stash/status)

| Lệnh | Chức năng | Ví dụ |
| :--- | :--- | :--- |
| `git status` | Xem trạng thái hiện tại: file nào đã sửa, đã stage, chưa theo dõi | `git status` |
| `git add` | Đưa thay đổi từ Working Directory vào Staging Area | `git add file.py` hoặc `git add .` (tất cả) |
| `git commit` | "Chốt" nội dung trong Staging Area thành 1 snapshot vĩnh viễn | `git commit -m "Sửa lỗi đăng nhập"` |
| `git stash` | "Cất tạm" các thay đổi chưa commit vào một ngăn kéo riêng, để dọn sạch working directory mà không mất code | `git stash` để cất, `git stash pop` để lấy lại |

---

### 4.3. Làm việc với nhánh (branch/checkout/switch/merge)

| Lệnh | Chức năng |
| :--- | :--- |
| `git branch <ten>` | Tạo nhánh mới (chỉ tạo con trỏ, chưa chuyển sang) |
| `git branch` | Liệt kê các nhánh hiện có |
| `git checkout <ten>` / `git switch <ten>` | Chuyển sang làm việc ở nhánh khác (switch là lệnh mới, rõ nghĩa hơn, thay thế dần checkout) |
| `git checkout -b <ten>` / `git switch -c <ten>` | Tạo nhánh mới VÀ chuyển sang luôn trong 1 lệnh |
| `git merge <ten>` | Hợp nhất lịch sử của nhánh khác vào nhánh hiện tại |
| `git log` | Xem lại lịch sử các "tấm ảnh chụp" (commit) đã tạo - ai commit, khi nào, message gì |
| `git tag <ten>` | Đặt nhãn cố định cho commit hiện tại (thường dùng đánh dấu bản release, vd: `git tag v1.0.0`) |

---

#### 4.3.1. Chú ý: Conflict xảy ra khi nào?

Khi 2 nhánh cùng sửa một dòng/khu vực giống nhau trong cùng 1 file, Git không tự biết nên giữ bản nào → dừng lại và yêu cầu người dùng quyết định.

**Git đánh dấu conflict như thế nào?**

Mở file bị conflict, sẽ thấy dạng:

```text
<<<<<<< HEAD
code của nhánh hiện tại (nhánh đang đứng)
=======
code của nhánh đang merge vào
>>>>>>> ten-nhanh-kia
```

**Các bước xử lý:**

| Bước | Thao tác thực hiện trên VS Code |
| :---: | :--- |
| **1** | Mở file bị conflict, quan sát 2 đoạn code tranh chấp bên dưới dòng `<<<<<<< HEAD` và `>>>>>>> ten-nhanh-kia`. |
| **2** | Bấm trực tiếp vào Nút bấm nhanh Inline ở ngay phía trên đoạn conflict:<br>• **Accept Current Change:** Giữ code nhánh hiện tại (HEAD).<br>• **Accept Incoming Change:** Giữ code nhánh đang gộp vào (ten-nhanh-kia).<br>• **Accept Both Changes:** Giữ cả hai đoạn code. |
| **3** | Lưu file (`Ctrl + S`), sau đó đánh dấu file đã giải quyết xong bằng cách bấm nút `+` (Stage Changes) ở tab Source Control. |
| **4** | Hoàn tất Merge Commit (Git sẽ tự điền sẵn message dạng `"Merge branch '...'"`). |

---

#### 4.3.2. Phân biệt Fast-Forward Merge và 3-Way Merge

**Tại sao có lúc Git tạo commit mới, có lúc lại không:**

- **Fast-Forward Merge:** Nhánh chính chưa có commit mới nào kể từ khi tách nhánh => Git chỉ đơn giản dịch chuyển con trỏ nhánh chính tiến lên. KHÔNG tạo merge commit mới, KHÔNG bao giờ bị conflict.
- **3-Way Merge:** Cả 2 nhánh đều có commit mới song song => Git tự động tìm điểm chung (Base) và tạo ra một Merge Commit mới có 2 commit cha (đây là lúc có thể xảy ra Conflict).

---

### 4.4. Đồng bộ từ xa (remote/pull/push/fetch)

| Lệnh | Chức năng |
| :--- | :--- |
| `git remote -v` | Xem danh sách server từ xa đang liên kết (thường là origin) |
| `git fetch` | Tải về các thay đổi mới nhất từ server, nhưng chưa hợp nhất vào code hiện tại — an toàn để "xem trước" |
| `git pull` | = `git fetch` + `git merge` gộp lại làm một — tải về VÀ hợp nhất luôn |
| `git push` | Đẩy các commit đã tạo trên máy mình lên server để chia sẻ với người khác |

---

### 4.5. Bộ lệnh "Cứu nguy" / Khôi phục

| Tình huống | Lệnh thực hiện | Bản chất |
| :--- | :--- | :--- |
| Hủy thay đổi file ở Working Directory (chưa add) | `git restore <file>` | Trả file về trạng thái ở commit gần nhất |
| Đưa file từ Staging Area quay lại Working Directory | `git restore --staged <file>` | Hủy thao tác `git add` nhầm |
| Sửa lại commit vừa tạo (sửa message hoặc thêm file sót) | `git commit --amend` | Gộp thay đổi mới vào commit gần nhất |
| Hủy commit chưa push (cục bộ) | `git reset --soft HEAD~1` | Lùi 1 commit, giữ nguyên code ở Staging |
| Hủy commit ĐÃ PUSH lên server chung | `git revert <commit-hash>` | Tạo commit mới để đảo ngược thay đổi (An toàn cho team) |
| Lỡ mất commit (vd sau khi reset --hard hoặc detached HEAD) | `git reflog` rồi `git checkout <hash-tìm-được>` | Xem lại "nhật ký di chuyển" của HEAD — gần như không có gì thực sự mất trong Git ngay cả khi tưởng đã mất |

---

## 5. Đánh giá, so sánh và Quy tắc sử dụng

### 5.1. Ưu/nhược điểm của Git

**Ưu điểm:**
- Tốc độ nhanh (thao tác cục bộ, không phụ thuộc mạng liên tục).
- An toàn dữ liệu cao (mỗi máy là 1 bản sao đầy đủ).
- Hỗ trợ branching/merging mạnh mẽ, phù hợp làm việc nhóm song song.
- Hệ sinh thái lớn: GitHub, GitLab, Bitbucket, CI/CD tích hợp sẵn.
- Miễn phí, mã nguồn mở.

**Nhược điểm:**
- Đường cong học tập ban đầu khá dốc (nhiều khái niệm: staging, HEAD, reflog...).
- Xử lý file nhị phân lớn (ảnh, video, file game) không hiệu quả bằng các công cụ chuyên dụng (Git LFS, Perforce).
- Lịch sử commit có thể trở nên rối nếu không có quy tắc làm việc rõ ràng trong nhóm.
- Dễ mắc lỗi nghiêm trọng nếu dùng sai lệnh mạnh (VD: `git push --force`, `git reset --hard`) mà không hiểu hậu quả.

---

### 5.2. Quy tắc làm việc chuẩn

- **Không commit thẳng vào main/master** — luôn tạo nhánh riêng (`feature/`, `fix/`, `bugfix/`) cho mỗi công việc.
- **Commit nhỏ, thường xuyên, message rõ ràng** — mỗi commit nên là 1 thay đổi logic hoàn chỉnh, message mô tả tại sao sửa chứ không chỉ sửa gì.
  - *Ví dụ tốt:* `fix: sửa lỗi crash khi đăng nhập với mật khẩu rỗng`
  - *Ví dụ chưa tốt:* `update`, `fix bug`, `abc`
- **Pull/fetch trước khi push** — luôn cập nhật code mới nhất từ team trước khi đẩy code lên, giảm conflict.
- **Dùng .gitignore** — không commit file build, file cấu hình cá nhân, `node_modules/`, file `.env` chứa thông tin nhạy cảm.
- **Review code qua Pull Request/Merge Request** — không tự merge trực tiếp vào nhánh chính khi làm nhóm, cần ít nhất 1 người khác review.
- **Tránh `git push --force` trên nhánh dùng chung** — lệnh này ghi đè lịch sử, có thể xóa mất commit của đồng đội.
- **Đặt tên nhánh có quy ước** — ví dụ: `feature/ten-tinh-nang`, `fix/ten-loi`, `hotfix/ten-loi-khan`, giúp cả nhóm dễ theo dõi.
