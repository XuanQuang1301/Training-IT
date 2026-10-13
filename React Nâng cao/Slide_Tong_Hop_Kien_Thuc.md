---
marp: true
theme: default
paginate: true
backgroundColor: #ffffff
color: #0f172a
style: |
  section {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    padding: 30px 50px;
    background-color: #ffffff;
  }
  h1, h2, h3 {
    color: #0f172a;
  }
  h1 { font-size: 36px; }
  h2 { font-size: 28px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; }
  h3 { font-size: 20px; color: #2563eb; }
  p, li { font-size: 14px; color: #334155; line-height: 1.5; }
  table { font-size: 12.5px; width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 6px 10px; }
  td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  .highlight { background-color: #fef08a; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
  .tag { font-size: 13px; font-weight: bold; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; }
---

<!-- Slide 1: Title -->
<div class="tag">TÀI LIỆU TRÌNH BÀY NỀN TẢNG</div>

# JavaScript, TypeScript & React Cơ Bản

### Hướng dẫn tổng hợp từ bối cảnh Web Modern, Static Typing đến React Engine

* **Nội dung**: Tóm gọn các kiến thức căn bản nhất, dễ hiểu nhất, dễ trình bày.
* **Phong cách**: Nền trắng rõ ràng, trực quan, cô đọng.

---

<!-- Slide 2: Mục lục tổng quan -->
<div class="tag">MỤC LỤC TRÌNH BÀY TỔNG QUAN</div>

## 4 Phần Nội Dung Chính Sẽ Trình Bày

1. **Phần 1: Nền Tảng Mạng & JavaScript Cho React**
   * Cấu trúc URL 9 thành phần & phân loại
   * Luồng truy vấn DNS & cơ chế CORS
   * Web Render Pipeline (Reflow/Repaint)
   * Biến, Scope, Event Loop & ES Modules

2. **Phần 2: TypeScript Cơ Bản Cho React**
   * Lý do cần TypeScript trong dự án
   * Kiểu dữ liệu mảng, object & hàm
   * Bộ tứ `void`, `never`, `any`, `unknown`
   * Interface vs Type cho React Props

3. **Phần 3: Kiến Thức React Cơ Bản & Bối Cảnh Web**
   * So sánh chi tiết SSR vs CSR
   * Kiến trúc Web: SPA vs MPA
   * Tooling hiện đại: Vite & pnpm
   * Class vs Function Component

4. **Phần 4: React Hooks Sâu Rộng**
   * Bản chất 8 Hooks & Fiber Linked List
   * Bộ tứ nền tảng: State & Effect
   * Cơ chế `useState` & `useReducer`
   * `useEffect` & `useLayoutEffect` (Async vs Sync)

---

<!-- Slide 3: Section 1 Intro -->
<div class="tag">NỘI DUNG CHI TIẾT PHẦN 1</div>

# PHẦN 1: Nền Tảng Mạng & JavaScript Cho React

* **1.1 Cấu Trúc URL & Phân Loại Đường Dẫn**
* **1.2 Origin, Cơ Chế CORS & Luồng DNS**
* **1.3 Webpage Rendering Pipeline (Reflow/Repaint)**
* **1.4 Biến, Scope & Phương Thức Mảng JS**
* **1.5 Event Loop (Đơn luồng JS) & Cú Pháp JS Modern**

---

<!-- Slide 4: Full URL Breakdown Slide -->
<div class="tag">PHẦN 1: MẠNG & JAVASCRIPT</div>

## 1.1 Cấu Trúc URL 9 Thành Phần Chi Tiết

`https://api.sydexa.vn:80/users/search?name=Minh&role=admin#results`

| Thành phần | Giá trị mẫu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **Scheme / Protocol** | `https://` | Nằm trước `://`, giao thức kết nối. HTTPS có mã hóa bảo mật. |
| **Subdomain** | `api` | Đứng trước domain chính, dùng chia vùng hệ thống (API, blog, admin). |
| **Domain** | `sydexa` | Tên định danh chính của website/tổ chức (tương tự địa chỉ tòa nhà). |
| **TLD** | `.vn` | Tên miền cấp cao nhất, cho biết loại hình tổ chức hoặc vị trí địa lý. |
| **Port** | `:80` | Cổng kết nối server (ngầm định HTTP: 80, HTTPS: 443). |
| **Path** | `/users/search` | Đường dẫn đến tài nguyên cụ thể (sau host, trước dấu `?`). |
| **Query Separator** | `?` | Cầu nối báo rằng path đã kết thúc và bắt đầu tham số truy vấn. |
| **Query Params** | `name=Minh&role=admin` | Các cặp `key=value` gửi thêm dữ liệu lọc/tìm kiếm cho server. |
| **Fragment** | `#results` | Neo trang do **Browser** xử lý. **KHÔNG** được gửi lên server. |

---

<!-- Slide 5 -->
<div class="tag">PHẦN 1: MẠNG & JAVASCRIPT</div>

## 1.2 Absolute vs Relative URL, Origin & CORS

### Absolute vs Relative URL
* **Absolute URL**: `http://api.sydexa.com` (Gọi API ngoài Origin).
* **Root-relative**: `/users/search` (Nội bộ cùng Origin).
* **Path-relative**: `./detail` hoặc `../profile` (Tương đối vị trí hiện tại).

### Origin & CORS Security
* **Origin** = `Protocol` + `Host` + `Port`. Khác 1 trong 3 → **Cross-Origin Request**.
* **CORS**: Cơ chế bảo mật do **Browser** kiểm tra response header (`Access-Control-Allow-Origin`).
* **URL Encoding**: Mã hóa ký tự đặc biệt trên URL (khoảng trắng → `%20`, dấu `&` → `%26`).

### 3 Bước Tra Cứu DNS & 3 Loại DNS Server
* **Bước 1**: Kiểm tra **Browser DNS Cache**.
* **Bước 2**: Kiểm tra **OS DNS Cache**.
* **Bước 3**: Hỏi **Recursive Resolver** (ISP / 1.1.1.1 / 8.8.8.8) đi qua chuỗi:
  1. **Root Server (Máy chủ gốc)**: 13 cụm toàn cầu (`a` đến `m.root-servers.net`), không chứa IP cụ thể mà điều hướng resolver sang TLD Server tương ứng.
  2. **TLD Server (Cấp cao nhất)**: Quản lý phần mở rộng (`.com`, `.vn`...), nắm danh sách và trỏ tiếp đến Authoritative Server của tên miền con.
  3. **Authoritative Server (Thẩm quyền cuối cùng)**: Nắm bản ghi DNS gốc (Cloudflare, AWS Route 53...), tra bảng và trả về IP thực sự (bản ghi A/AAAA).

---

<!-- Slide 6 -->
<div class="tag">PHẦN 1: MẠNG & JAVASCRIPT</div>

## 1.3 Webpage Rendering Pipeline (Code → Pixel)

**HTML/CSS** → **DOM / CSSOM** → **Render Tree** → **Layout (Reflow)** → **Paint (Repaint)** → **Composite** → **Screen**

### Chi tiết từng giai đoạn:
* **Parsing**: Đọc HTML thành DOM Tree, đọc CSS thành CSSOM Tree.
* **Render Tree**: Kết hợp DOM + CSSOM (loại bỏ node `display: none`).
* **Layout (Reflow)**: Tính toán vị trí ($x, y$) và kích thước rộng/cao.
* **Paint (Repaint)**: Điền màu sắc, hình ảnh vào từng pixel.
* **Composite**: Hợp nhất layer hiển thị lên màn hình.

---

<!-- Slide 7 -->
<div class="tag">PHẦN 1: MẠNG & JAVASCRIPT</div>

## 1.4 Biến, Scope & Phương Thức Mảng JS

### Biến & Immutability trong React
* `var`: Function scope (Tránh dùng).
* `let`: Block scope, cho phép gán lại.
* `const`: Block scope, không gán lại reference.
* <span class="highlight">Chú ý React State:</span> Ưu tiên **Immutability** (tạo reference mới thay vì mutate trực tiếp object/array).

### Bộ Ba Phương Thức Mảng Cốt Lõi
* `map()`: Biến đổi mảng thành mảng mới cùng độ dài (Dùng render list JSX).
* `filter()`: Lọc các phần tử thỏa mãn điều kiện.
* `reduce()`: Gom mảng về 1 giá trị duy nhất.

---

<!-- Slide 8 -->
<div class="tag">PHẦN 1: MẠNG & JAVASCRIPT</div>

## 1.5 Event Loop & Cú Pháp JS Modern

### Event Loop (Đơn luồng JS)
* **Call Stack**: Thực thi code đồng bộ.
* **Microtasks** (Ưu tiên cao): `Promise`, `async/await`.
* **Macrotasks** (Ưu tiên thấp): `setTimeout`, `setInterval`.
* *Thứ tự:* Call Stack trống → Chạy hết Microtasks → Chạy 1 Macrotask.

### Cú Pháp JS Modern Cần Thiết
* `?.` (Optional Chaining): Tránh crash fatal khi truy cập thuộc tính `null`/`undefined`.
* `??` (Nullish Coalescing): Chỉ lấy vế sau khi vế trước `null`/`undefined` (giữ lại `0`, `""`, `false`).
* `finally`: Khối code **luôn luôn chạy** để tắt trạng thái loading.

---

<!-- Slide 9: Section 2 Intro -->
<div class="tag">NỘI DUNG CHI TIẾT PHẦN 2</div>

# PHẦN 2: TypeScript Cơ Bản Cho React

* **2.1 Tại Sao Cần TS & Kiểu Dữ Liệu Cơ Bản**
* **2.2 Bộ Tứ Đặc Biệt (void, never, any, unknown) & Interface/Type**

---

<!-- Slide 10 -->
<div class="tag">PHẦN 2: TYPESCRIPT CƠ BẢN</div>

## 2.1 Tại Sao Cần TS & Kiểu Dữ Liệu Cơ Bản

### Tại Sao Dùng TypeScript?
* **JavaScript**: Dynamically Typed → Phát hiện lỗi muộn ở **Runtime** (máy người dùng).
* **TypeScript**: Statically Typed → Phát hiện lỗi ngay ở **Compile Time** trong IDE.

### Cú Pháp Type Cơ Bản
```typescript
let name: string = "Sydexa";
let age: number = 25;
let scores: number[] = [1, 2, 3];
let userTuple: [number, string] = [1, "Admin"];
```

---

<!-- Slide 11 -->
<div class="tag">PHẦN 2: TYPESCRIPT CƠ BẢN</div>

## 2.2 Bộ Tứ Đặc Biệt & Interface/Type

### Bộ Tứ: `void`, `never`, `any`, `unknown`
* `void`: Hàm không trả về giá trị (`return undefined`).
* `never`: Giá trị KHÔNG BAO GIỜ xảy ra (`throw error` hoặc vòng lặp vô tận).
* `any`: Tắt mọi kiểm tra kiểu (Nguy hiểm, tránh dùng).
* `unknown`: Kiểu chưa xác định (An toàn hơn `any`, bắt buộc **Type Narrowing** trước khi dùng).

### Interface vs Type cho Props
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}
type Status = "idle" | "loading" | "success";
```

---

<!-- Slide 12: Section 3 Intro -->
<div class="tag">NỘI DUNG CHI TIẾT PHẦN 3</div>

# PHẦN 3: Kiến Thức React Cơ Bản & Bối Cảnh Web

* **3.1 SSR vs CSR (Nơi Render Quyết Định Tất Cả)**
* **3.2 SPA vs MPA (Kiến Trúc Ứng Dụng Web)**
* **3.3 Modern Tooling (Vite, pnpm) & Cấu Trúc Dự Án**
* **3.4 Tiến Hóa Component: Class vs Function Component**

---

<!-- Slide 13 -->
<div class="tag">PHẦN 3: REACT CƠ BẢN</div>

## 3.1 SSR vs CSR (Nơi Render Quyết Định Tất Cả)

| Tiêu chí | SSR (Server Side Rendering) | CSR (Client Side Rendering) |
| :--- | :--- | :--- |
| **Nơi render** | Server | Trình duyệt (Browser) |
| **HTML ban đầu** | Hoàn chỉnh, đầy đủ nội dung | Vỏ trống `<div id="root"></div>` |
| **Tốc độ hiển thị lần đầu (FCP)** | Nhanh (HTML có sẵn từ server) | Chậm (Chờ JS tải & chạy) |
| **Thời gian tương tác (TTI)** | Chậm hơn FCP (Chờ Hydration) | FCP = TTI (Tương tác ngay khi hiện) |
| **Tải CPU** | Server tốn CPU (render mỗi request) | Máy người dùng tốn CPU |
| **Bandwidth** | Nhiều (Gửi HTML đầy đủ mỗi request) | Ít hơn sau lần đầu (JS tải 1 lần, sau chỉ gọi API JSON) |
| **SEO** | Tuyệt vời (HTML sẵn cho crawler) | Kém (Crawler khó đọc JS-rendered content) |
| **Offline Support** | Không thể (Phụ thuộc server) | Tốt (Có thể cache app shell & data) |
| **Phù hợp cho** | Blog, landing page, e-commerce, trang cần SEO | Dashboard, chat app, SaaS, ứng dụng interactive cao |

---

<!-- Slide 14 -->
<div class="tag">PHẦN 3: REACT CƠ BẢN</div>

## 3.1 SSR vs CSR: Ưu Điểm, Nhược Điểm & Kết Luận

### Server Side Rendering (SSR)
* **Ưu điểm:**
  * Tốc độ hiển thị lần đầu (FCP) nhanh vượt trội do HTML có sẵn.
  * SEO tuyệt vời, công cụ tìm kiếm dễ dàng crawl dữ liệu.
  * Hiển thị tốt trên thiết bị cấu hình yếu.
* **Nhược điểm:**
  * Server chịu tải nặng (100.000 người = 100.000 lần render trên server).
  * Hiện tượng **Uncanny Valley** (thấy nút nhưng bấm chưa ăn, chờ Hydration).
  * Mỗi lần chuyển trang truyền thống là một round-trip đến server.

### Client Side Rendering (CSR)
* **Ưu điểm:**
  * Trải nghiệm người dùng (UX) cực mượt sau lần load đầu, chuyển trang tức thì.
  * Giảm tải server (máy chủ chỉ phục vụ static bundle & API JSON).
  * Hỗ trợ Offline tốt qua caching và Service Worker.
* **Nhược điểm:**
  * Lần load đầu chậm (JS bundle lớn 500KB+ cần thời gian tải & parse).
  * SEO kém (Web crawler khó đọc dynamic JS-rendered content).
  * Phụ thuộc JavaScript hoàn toàn (tắt JS hoặc lỗi script là trắng trang).

> **Kết luận:** Không có winner tuyệt đối, chỉ có đúng context. SSR thắng ở tốc độ hiển thị đầu và SEO. CSR thắng ở trải nghiệm tương tác. Câu trả lời đúng luôn là: **phụ thuộc vào bài toán của bạn** *(hoặc dùng Hybrid Rendering như Next.js / Remix)*.

---

<!-- Slide 15 -->
<div class="tag">PHẦN 3: REACT CƠ BẢN</div>

## 3.2 SPA vs MPA (Kiến Trúc Ứng Dụng Web)

> **Lưu ý quan trọng:** **SSR / CSR** nói về *CÁCH RENDER*. Còn **SPA / MPA** nói về *KIẾN TRÚC ỨNG DỤNG*. Đừng nhầm lẫn hai khái niệm này!

| Tiêu chí | SPA (Single Page Application) | MPA (Multi Page Application) |
| :--- | :--- | :--- |
| **Số trang HTML** | **1 HTML duy nhất** + JS Router | **N trang HTML** riêng biệt từ server |
| **Khi user click "About"** | Content fade out → fade in nội dung mới. URL đổi nhưng **KHÔNG reload**. Header, sidebar giữ nguyên | **Flash trắng** toàn màn hình → trang **MỚI hoàn toàn** load từ đầu. Tất cả elements render lại |
| **Tốc độ chuyển trang** | **~50ms** – gần như tức thì | **~800ms** – phải chờ server response + full reload |
| **Cơ chế hoạt động** | 1 HTML + JS Router – chỉ thay đổi phần cần thay đổi | N HTMLs + Server render – mỗi trang là một request mới |

* **SPA (Single Page Application):** Chỉ load MỘT trang HTML duy nhất. Sau đó mọi điều hướng, thay đổi nội dung đều do JavaScript xử lý. Không reload. Không flash trắng. *Ví dụ: Gmail, Figma, Notion, Facebook.*
* **MPA (Multi Page Application):** Kiểu truyền thống. Mỗi URL là một trang HTML riêng từ server. Click link là full page reload. *Ví dụ: Wikipedia, trang tin tức, e-commerce truyền thống.*

---

<!-- Slide 16 -->
<div class="tag">PHẦN 3: REACT CƠ BẢN</div>

## 3.3 Tooling Modern & Cấu Trúc Dự Án

### Công Cụ Modern (Vite & pnpm)
* **React** là **UI Library**, không phải Framework full-stack nguyên khối.
* **Vite**: Dùng Native ES Modules qua Rollup/esbuild, dev server chạy tức thì (~300ms) thay vì Webpack CRA (~8s).
* **pnpm**: Sử dụng Global Store + Hard Links, tiết kiệm 90% dung lượng đĩa và cài đặt gói cực nhanh.

### Architecture & Mount Flow
* **Mount Flow**: `index.html` → `main.jsx` → `App.jsx`.
* **Group by Type** (Dự án nhỏ): `components/`, `hooks/`, `utils/`, `services/`.
* **Group by Feature** (Dự án lớn): `features/auth/`, `features/product/`, `shared/`.

---

<!-- Slide 17 -->
<div class="tag">PHẦN 3: REACT CƠ BẢN</div>

## 3.4 Tiến Hóa: Class vs Function Component

### Class Component (Legacy)
* Rắc rối với con trỏ `this` (dễ crash khi quên bind trong constructor).
* **Lifecycle Hell**: Logic 1 tính năng bị xé nhỏ ra 3 hàm (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`).
* Khó tái sử dụng logic (phải dựa vào HOC hoặc Render Props). Code rườm rà (Boilerplate).

### Function Component + Hooks (Chuẩn Modern)
* Không dùng con trỏ `this`, là JavaScript function thuần túy.
* **`useEffect`** gom toàn bộ logic kết nối & dọn dẹp vào **duy nhất 1 chỗ**.
* Dễ chia sẻ stateful logic bằng Custom Hooks mà không làm thay đổi phân cấp UI.
* Code ngắn gọn hơn ~60%, rõ ràng, dễ bảo trì & viết Unit Test.

---

<!-- Slide 18: Section 4 Intro -->
<div class="tag">NỘI DUNG CHI TIẾT PHẦN 4</div>

# PHẦN 4: React Hooks - Hiểu Sâu Từ Bên Trong

* **4.1 Bản Chất Hooks: 8 Hooks, 1 Linked List & Bộ Tứ Nền Tảng**
* **4.2 useState - Quản Lý State, Stale Closure & Lazy Initialization**
* **4.3 useEffect - Quản Lý Side Effect, Timing & Cleanup Function**
* **4.4 useLayoutEffect - Người Anh Em Đồng Bộ Trước Paint**
* **4.5 useReducer - Tổng Đài Điều Phối State Phức Tạp**

---

<!-- Slide 19 -->
<div class="tag">PHẦN 4: REACT HOOKS</div>

## 4.1 Bản Chất Hooks: 8 Hooks, 1 Linked List & Bộ Tứ Nền Tảng

> **Khái niệm:** Hooks là các hàm cho phép Function Component **gắn vào State và Vòng đời** của React. Toàn bộ hooks của một component được lưu trên **MỘT Linked List duy nhất trên Fiber Node** và nhận diện qua **thứ tự gọi**.

### Kiến Trúc & Luật Bất Biến
* **8 Hooks cơ bản:** `useState`, `useEffect`, `useLayoutEffect`, `useReducer`, `useMemo`, `useCallback`, `useContext`, `useRef`.
* **Quy tắc tối thượng:** Chỉ gọi hook ở top-level; **không gọi trong if/else, vòng lặp hay hàm lồng**.
* **Nguyên nhân:** Lệch thứ tự gọi → Lệch con trỏ Linked List trên Fiber Node → Đọc sai ô nhớ state → Crash ứng dụng.

### Bộ Tứ Nền Tảng (State & Effect)
* **1. useState:** Khởi tạo & lưu State nội bộ đơn giản, kích hoạt re-render UI.
* **2. useEffect:** Xử lý Side Effect (API, timer, event) bất đồng bộ sau Paint.
* **3. useLayoutEffect:** Đo đạc & sửa DOM đồng bộ trước Paint để chặn nháy hình (flicker).
* **4. useReducer:** Quản lý State phức tạp tập trung theo mô hình Action/Reducer.

---

<!-- Slide 20 -->
<div class="tag">PHẦN 4: REACT HOOKS</div>

## 4.2 useState - Quản Lý Trạng Thái (State) Nội Bộ

> **Khái niệm:** `useState` dùng để **lưu trữ và cập nhật dữ liệu động (State)** bên trong Function Component.  
> Khi State thay đổi, React tự động **kích hoạt Re-render** để cập nhật UI.  
> **Cú pháp:** `const [state, setState] = useState(initialValue);`

### Stale Closure & Functional Update
* **Bẫy Stale Closure:** Gọi `setCount(count + 1)` 3 lần liên tiếp chỉ tăng 1 vì biến `count` bị đóng băng ở render hiện tại.
* **Functional Update:** Luôn dùng `setCount(prev => prev + 1)` khi state mới tính từ state cũ để nhận giá trị mới nhất.
* **React 18 Batching:** Tự động gom nhiều lần `setState` trong cùng tick thành duy nhất 1 lần re-render.

### Lazy Initialization (Khởi Tạo Lười)
* **Vấn đề:** `useState(expensiveCalc())` khiến hàm tính toán chạy lại ở **mọi lần re-render** (lãng phí CPU).
* **Giải pháp:** `useState(() => expensiveCalc())` truyền callback để React **chỉ gọi 1 lần duy nhất khi Mount**.
* **Ứng dụng:** Đọc `localStorage`, parse JSON lớn, hoặc tạo cấu trúc mảng/object ban đầu.

---

<!-- Slide 21 -->
<div class="tag">PHẦN 4: REACT HOOKS</div>

## 4.3 useEffect - Quản Lý Tác Vụ Phụ (Side Effect)

> **Khái niệm:** `useEffect` dùng để **đồng bộ component với các hệ thống bên ngoài (Side Effect)** như gọi API, event listener, Timer, thao tác DOM.  
> **Cơ chế:** Chạy **bất đồng bộ SAU KHI trình duyệt đã vẽ UI (After Paint)** để không chặn giao diện.

### Dependency Array (Kiểm Soát Vòng Đời)
* `useEffect(fn)`: Chạy lại sau **mọi lần render** của component.
* `useEffect(fn, [])`: Chỉ chạy **1 lần duy nhất khi Mount** (tương tự `componentDidMount`).
* `useEffect(fn, [deps])`: Chỉ chạy lại khi có ít nhất một dependency thay đổi (so sánh `Object.is`).

### Cleanup Function (Dọn Dẹp Bộ Nhớ)
* **Cú pháp:** Trả về hàm dọn dẹp: `return () => { /* hủy tác vụ */ };`
* **Thời điểm chạy:** Chạy ngay trước effect kế tiếp và khi component **Unmount khỏi DOM**.
* **Nhiệm vụ:** Hủy `clearInterval`, gỡ `removeEventListener`, ngắt WebSocket, abort fetch request để tránh **Memory Leak**.

---

<!-- Slide 22 -->
<div class="tag">PHẦN 4: REACT HOOKS</div>

## 4.4 useLayoutEffect - Xử Lý DOM Đồng Bộ Trước Khi Paint

> **Khái niệm:** `useLayoutEffect` chạy **ĐỒNG BỘ sau khi DOM cập nhật nhưng TRƯỚC KHI trình duyệt vẽ (Before Paint)**. Nó chặn browser vẽ để đọc/sửa DOM ngay lập tức nhằm **triệt tiêu hoàn toàn hiện tượng nháy hình (Flicker)**.

### So Sánh useEffect vs useLayoutEffect
* `useEffect`: Chạy SAU Paint (Async) → Không chặn browser vẽ, thích hợp cho API, timer, event listener.
* `useLayoutEffect`: Chạy TRƯỚC Paint (Sync) → Chặn browser vẽ, thích hợp cho đo đạc DOM, scroll, layout.
* *Quy tắc:* 99% tác vụ dùng `useEffect`. Chỉ dùng `useLayoutEffect` khi giao diện bị giật nháy layout.

### 3 Kịch Bản Sử Dụng Thực Tế
1. **Đo đạc DOM:** Đo chiều cao thẻ cha cho Virtual Scroll hoặc đo kích thước Tooltip để căn vị trí không tràn viewport.
2. **Đồng bộ vị trí Scroll:** Reset `scrollTop = 0` ngay tức thì khi chuyển trang/tab để tránh bị nảy khung hình.
3. **Khởi tạo Animation:** Thiết lập vị trí/opacity ban đầu trước khi vẽ (tránh Flash of Unstyled Content).
* *Lưu ý SSR:* Trên Next.js/SSR dùng `useIsomorphicLayoutEffect` để tránh lỗi server.

---

<!-- Slide 23 -->
<div class="tag">PHẦN 4: REACT HOOKS</div>

## 4.5 useReducer - Quản Lý Trạng Thái Phức Tạp Tập Trung

> **Khái niệm:** `useReducer` dùng để **quản lý State phức tạp hoặc nhiều state phụ thuộc nhau** thông qua một hàm Reducer tập trung duy nhất theo mô hình: `(state, action) => newState`.  
> **Cú pháp:** `const [state, dispatch] = useReducer(reducer, initialArg);`

### Cơ Chế & 3 Nguyên Tắc Reducer
* **1. Pure Function:** Cùng input (state + action) luôn trả về cùng 1 output duy nhất, không ngẫu nhiên.
* **2. Immutability Tuyệt Đối:** Không mutate state cũ (không `push`/`splice`), luôn tạo object/array mới.
* **3. Không Side Effect:** Tuyệt đối không gọi API, timer hay can thiệp DOM bên trong reducer.
* *Stable Reference:* Hàm `dispatch` không bao giờ đổi địa chỉ bộ nhớ qua các lần re-render.

### Khi Nào Dùng useState vs useReducer?
* **Chọn useState:** State đơn giản, độc lập (1-3 biến: boolean toggle, input text, counter).
* **Chọn useReducer:** Nhiều state phụ thuộc nhau (ví dụ: `data`, `isLoading`, `error`), form phức tạp, CRUD danh sách.
* **Lợi ích lớn nhất:** Tách 100% logic cập nhật ra khỏi UI component → Cực kỳ dễ viết Unit Test độc lập.

---

<!-- Slide 24 -->
<div class="tag">TỔNG KẾT SLIDE DECK</div>

# 4 Trụ Cột Nền Tảng

1. **JS & Web Core**: Nắm vững URL 9 thành phần, DNS (Root, TLD, Auth), Web Render Pipeline (Reflow/Repaint), Event Loop & Immutability.
2. **Type Safety**: Chuyển từ Runtime Error sang Compile Time Error với TypeScript, Generic & Interface/Type.
3. **React Engine**: Làm chủ SSR vs CSR, SPA vs MPA, Tooling hiện đại (Vite + pnpm) & Class vs Function Component.
4. **React Hooks Mastery**: Fiber Linked List, Bộ tứ State & Effect (useState, useEffect, useLayoutEffect, useReducer).

*Cảm ơn bạn đã lắng nghe bài trình bày!*
