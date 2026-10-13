# TỔNG HỢP KIẾN THỨC NỀN TẢNG REACT & TYPESCRIPT

> **Tài liệu tóm gọn kiến thức cốt lõi:** 
> 1. Nền tảng Mạng & JavaScript cho React
> 2. TypeScript Cơ Bản cho React
> 3. Kiến thức React Cơ Bản & Bối cảnh Web Modern

---

## PHẦN 1: NỀN TẢNG MẠNG & JAVASCRIPT CHO REACT

### 1. Structure Đầy Đủ 9 Thành Phần của URL
Ví dụ về URL: `https://api.sydexa.vn:80/users/search?name=Minh&role=admin#results`

| # | Thành phần | Giá trị mẫu | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| 1 | **Scheme / Protocol** | `https://` | Nằm trước dấu `://`. Giao thức trình duyệt dùng để kết nối với server. HTTPS là HTTP có thêm lớp mã hóa bảo mật. |
| 2 | **Subdomain** | `api` | Phần đứng trước domain chính, dùng để phân chia khu vực ứng dụng (API, blog, admin). |
| 3 | **Domain** | `sydexa` | Tên thương hiệu / tổ chức. Tên định danh chính của website (giống tên tòa nhà trên bản đồ Internet). |
| 4 | **TLD** | `.vn` | Tên miền cấp cao nhất. Cho biết loại hình tổ chức hoặc vị trí địa lý. Ví dụ: `.com` (thương mại), `.org` (tổ chức), `.edu` (giáo dục). |
| 5 | **Port** | `:80` | Cổng kết nối trên server. Thông thường được ẩn đi vì browser ngầm định Port 80 cho HTTP và Port 443 cho HTTPS. Chỉ hiện rõ khi chạy ở custom ports khác. |
| 6 | **Path** | `/users/search` | Phần sau host, trước dấu `?`. Đường dẫn đến tài nguyên cụ thể trên server (như đi vào thư mục `users` rồi đến màn hình `search`). |
| 7 | **Query Separator** | `?` | Cầu nối path và query. Dấu `?` báo rằng path đã kết thúc và phần tham số truy vấn bắt đầu. |
| 8 | **Query Params** | `name=Minh&role=admin` | Dữ liệu lọc / tìm kiếm dạng các cặp `key=value` gửi cho server, nối với nhau bằng dấu `&`. |
| 9 | **Fragment / Hash** | `#results` | Neo trong trang chỉ do **Browser** xử lý, dùng nhảy tới một vùng giao diện. Fragment **KHÔNG** được gửi lên server. |

#### Absolute vs Relative URL
| Dạng URL | Ví dụ | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Absolute URL** | `http://api.sydexa.com/users` | Trỏ đầy đủ domain, dùng khi gọi API external ngoài Origin |
| **Root-relative URL** | `/users/search` | Trỏ từ root domain, dùng nội bộ cùng Origin |
| **Path-relative URL** | `./detail` hoặc `../profile` | Trỏ tương đối so với thư mục hiện tại |

* **URL Encoding/Decoding**: Mã hóa các ký tự đặc biệt trên URL (ví dụ: `%20` là khoảng trắng, `%26` là dấu `&`).

---

### 2. Origin, CORS & Luồng tra cứu DNS
* **Origin** = `Protocol` + `Host (Domain)` + `Port`. 
  * Ví dụ: `http://localhost:3000` khác origin với `https://localhost:3000` (khác protocol) và `http://localhost:8080` (khác port).
* **CORS (Cross-Origin Resource Sharing)**: Cơ chế bảo mật phía **Browser**. Browser tự động chặn response nếu request gửi sang Origin khác mà Server không trả về response header cho phép (`Access-Control-Allow-Origin`).

#### Luồng Tra Cứu DNS (DNS Resolution)
Chuyển đổi từ **Domain Name** $\rightarrow$ **Địa chỉ IP**:
1. **Browser DNS Cache**: Trình duyệt kiểm tra cache gần đây.
2. **OS DNS Cache**: Trình duyệt hỏi cache của Hệ điều hành.
3. **Recursive Resolver** (ISP / DNS 1.1.1.1 / 8.8.8.8): Nếu cache trống, Resolver đi hỏi tiếp theo thứ tự:
   * **Root Name Server** $\rightarrow$ Trỏ tới server quản lý đuôi TLD.
   * **TLD Name Server** (ví dụ `.com`, `.vn`) $\rightarrow$ Trỏ tới Server quản lý domain.
   * **Authoritative Name Server** $\rightarrow$ Trả về địa chỉ IP thực sự.

---

### 3. Webpage Rendering Pipeline (Từ Code đến Pixel)
Quá trình trình duyệt nhận HTML/CSS/JS và dựng giao diện:

```
[HTML] ---> DOM Tree \
                      ===> Render Tree ---> Layout (Reflow) ---> Paint (Repaint) ---> Composite ---> Screen
[CSS]  ---> CSSOM    /
```

1. **Parsing**: Đọc HTML tạo cây **DOM Tree**, đọc CSS tạo cây **CSSOM Tree**.
2. **Render Tree**: Kết hợp DOM và CSSOM (chỉ giữ các node hiển thị, loại bỏ `display: none`).
3. **Layout (Reflow)**: Tính toán chính xác vị trí ($x, y$) và kích thước (rộng, cao) của từng phần tử.
4. **Paint (Repaint)**: Điền màu sắc, hình ảnh, văn bản vào các pixel.
5. **Composite**: Hợp nhất các layer và vẽ lên màn hình (Screen).

---

### 4. Biến & Scope trong JavaScript
* **`var`**: Function scope, có hoisting, không bị giới hạn bởi khối lệnh `{}`. Tránh dùng trong React.
* **`let`**: Block scope `{}`. Cho phép **gán lại giá trị** (reassign).
* **`const`**: Block scope `{}`. **Không cho phép gán lại** giá trị của biến.
  > ⚠️ **Lưu ý quan trọng:** `const` chỉ chặn gán lại reference, nếu biến chứa `Object` hoặc `Array`, bạn **vẫn có thể sửa đổi property/element bên trong** (Mutation). Tuy nhiên trong React, ta luôn ưu tiên **Immutability** (tạo object/array mới thay vì mutate).

```javascript
// Thay vì mutate trực tiếp:
// state.count = 1; (X)

// Trong React State ta luôn tạo reference mới:
const [count, setCount] = useState(0);
setCount(prev => prev + 1); // (O)
```

---

### 5. Bộ ba Phương Thức Mảng Cốt Lõi (`map`, `filter`, `reduce`)
* **`map()`**: Biến đổi từng phần tử trong mảng thành phần tử mới $\rightarrow$ trả về mảng mới cùng độ dài (Dùng rất nhiều để render danh sách JSX).
* **`filter()`**: Lọc các phần tử thỏa mãn điều kiện $\rightarrow$ trả về mảng mới chứa các phần tử thỏa mãn.
* **`reduce()`**: Gộp toàn bộ mảng về một giá trị duy nhất (số, chuỗi, object, mảng mới...).

---

### 6. Bất Đồng Bộ (Async) & Event Loop
JavaScript là ngôn ngữ **Single-threaded** (đơn luồng). Nếu chạy đồng bộ các tác vụ nặng (API call, Timer), UI sẽ bị ngắt kết nối và đóng băng (Block UI).

#### Cơ chế Event Loop:
1. **Call Stack**: Nơi thực thi các hàm đồng bộ.
2. **Web APIs**: Trình duyệt xử lý các tác vụ bất đồng bộ (Fetch, `setTimeout`, DOM Event).
3. **Microtask Queue** (Ưu tiên cao): Chứa callback của **Promise**, `async/await`, `queueMicrotask`.
4. **Macrotask Queue / Task Queue** (Ưu tiên thấp): Chứa callback của `setTimeout`, `setInterval`.

> 💡 **Thứ tự thực thi:** Call Stack trống $\rightarrow$ Chạy sạch **TẤT CẢ** công việc trong Microtask Queue $\rightarrow$ Chạy **1 công việc** trong Macrotask Queue.

---

### 7. ES Modules trong React
Tổ chức code theo mô hình module: Mỗi Component / Hook / Utility là 1 file độc lập.

| Tiêu chí | Named Export | Default Export |
| :--- | :--- | :--- |
| **Cách Export** | `export const Button = ...` | `export default Button` |
| **Cách Import** | `import { Button } from './Button'` | `import MyButton from './Button'` |
| **Số lượng/file** | Nhiều Named Export trong 1 file | Duy nhất 1 Default Export trong 1 file |
| **Đổi tên** | Phải dùng từ khóa `as` | Đặt tên tự do khi import |

---

### 8. Cú Pháp Modern JS Cần Thiết Cho React

#### Destructuring & Default Parameters
```javascript
// Unpack props trực tiếp trong function param
const UserCard = ({ name, role = 'User' }) => {
  return <div>{name} - {role}</div>;
};
```

#### Optional Chaining (`?.`) & Nullish Coalescing (`??`)
* **Optional Chaining (`?.`)**: Truy cập an toàn vào thuộc tính lồng nhau. Nếu gặp `null` hoặc `undefined` sẽ dừng lại và trả về `undefined` thay vì throw fatal crash error.
* **Nullish Coalescing (`??`)**: Chỉ lấy giá trị vế sau khi vế trước là `null` hoặc `undefined`. (Khác với `||` vốn coi `0`, `""`, `false` là falsy values).

```javascript
const userName = user?.profile?.name; 
const count = data.count ?? 0; // Nếu count = 0 thì vẫn giữ 0 (|| sẽ đổi thành 0 thành false)
```

#### Structured Error Handling (`try / catch / finally`)
* **`finally`**: Khối code **LUÔN LUÔN CHẠY** dù thành công hay xảy ra lỗi (Rất thích hợp để tắt trạng thái `loading`).

```javascript
async function fetchData() {
  try {
    setLoading(true);
    const res = await fetch('/api/data');
    const data = await res.json();
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false); // Luôn tắt spinner
  }
}
```

---
---

## PHẦN 2: TYPESCRIPT CƠ BẢN CHO REACT

### 1. Tại Sao Cần TypeScript?
* **JavaScript**: Ngôn ngữ kiểu động (Dynamically Typed) $\rightarrow$ Phát hiện lỗi muộn ở **Runtime** (khi ứng dụng đang chạy ở máy người dùng).
* **TypeScript**: Ngôn ngữ kiểm tra kiểu tĩnh (Statically Typed) $\rightarrow$ Phát hiện lỗi ngay ở **Compile Time** (khi đang gõ code trong IDE).

---

### 2. Các Kiểu Dữ Liệu Cơ Bản & Mảng (Array)
```typescript
// Kiểu nguyên thủy
let name: string = "Sydexa";
let age: number = 25;
let isActive: boolean = true;

// Kiểu mảng (Array)
let scores: number[] = [1, 2, 3];
let names: Array<string> = ["A", "B"];

// Tuple (Mảng cố định số phần tử và kiểu dữ liệu từng vị trí)
let userTuple: [number, string] = [1, "Admin"];
```

---

### 3. Định Nghĩa Hàm (Function Types)
```typescript
// Khai báo type cho param và return value
const add = (a: number, b: number): number => {
  return a + b;
};

// Callback function type
type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
```

---

### 4. Bộ Tứ Đặc Biệt: `void`, `never`, `any`, `unknown`

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      BỘ TỨ ĐẶC BIỆT                         │
 ├──────────────┬──────────────────────────────────────────────┤
 │ void         │ Hàm không trả về giá trị (return undefined). │
 ├──────────────┼──────────────────────────────────────────────┤
 │ never        │ Giá trị KHÔNG BAO GIỜ xảy ra (throw error    │
 │              │ hoặc vòng lặp vô tận).                       │
 ├──────────────┼──────────────────────────────────────────────┤
 │ any          │ Tắt mọi kiểm tra kiểu (Nguy hiểm, tránh dùng).│
 ├──────────────┼──────────────────────────────────────────────┤
 │ unknown      │ Kiểu chưa xác định (An toàn hơn any, bắt buộc│
 │              │ Type Narrowing trước khi truy cập property). │
 └──────────────┴──────────────────────────────────────────────┘
```

#### So sánh `any` vs `unknown`:
```typescript
// any (Không an toàn)
let dataAny: any = "Hello";
dataAny.foo.bar(); // Không báo lỗi lúc code, nhưng CRASH ở runtime!

// unknown (An toàn)
let dataUnknown: unknown = "Hello";
// dataUnknown.toUpperCase(); // TS Báo lỗi ngay!

if (typeof dataUnknown === "string") {
  console.log(dataUnknown.toUpperCase()); // Hợp lệ sau khi Type Narrowing
}
```

---

### 5. Type Alias vs Interface trong React

```typescript
// Dùng Interface cho Props / Objects mở rộng được
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean; // Optional prop
}

// Dùng Type cho Unions, Primitives hoặc Tuples
type Status = "idle" | "loading" | "success" | "error";
```

---
---

## PHẦN 3: KIẾN THỨC REACT CƠ BẢN & BỐI CẢNH WEB MODERN

### 1. SSR vs CSR (Nơi Render Quyết Định Tất Cả)

#### Server Side Rendering (SSR)
* **Luồng chạy**: Browser gửi Request $\rightarrow$ Server render HTML hoàn chỉnh $\rightarrow$ Trình duyệt hiển thị ngay giao diện tĩnh (**FCP nhanh**) $\rightarrow$ Tải JavaScript Bundle $\rightarrow$ Thực hiện quá trình **Hydration** (gắn event listeners vào DOM) $\rightarrow$ Có thể tương tác được (**TTI**).
* **Hiện tượng Uncanny Valley**: Khoảng thời gian từ khi người dùng THẤY nút bấm cho tới khi BẤM ĐƯỢC (do JS Bundle đang tải/hydrate).

#### Client Side Rendering (CSR)
* **Luồng chạy**: Browser gửi Request $\rightarrow$ Server trả về file HTML rỗng vỏ `<div id="root"></div>` + file JS Bundle lớn $\rightarrow$ Trình duyệt chạy JS để tự dựng UI.
* **Đặc điểm**: Màn hình trắng / loading lúc đầu, nhưng khi giao diện xuất hiện thì **FCP = TTI** (Tương tác được ngay, không có Uncanny Valley).

#### Bảng So Sánh SSR vs CSR
| Tiêu chí | SSR (Server Side Rendering) | CSR (Client Side Rendering) |
| :--- | :--- | :--- |
| **Nơi render** | Server | Trình duyệt (Browser) |
| **HTML ban đầu** | Hoàn chỉnh, đầy đủ nội dung | Vỏ trống `<div id="root"></div>` |
| **Tốc độ hiển thị lần đầu (FCP)** | Nhanh (HTML có sẵn từ server) | Chậm (Chờ JS tải & chạy) |
| **Thời gian tương tác (TTI)** | Chậm hơn FCP (Chờ Hydration) | FCP = TTI (Tương tác ngay khi hiện) |
| **Tải CPU** | Server tốn CPU (render mỗi request) | Máy người dùng tốn CPU |
| **Bandwidth** | Nhiều (Gửi HTML đầy đủ mỗi request) | Ít hơn sau lần đầu (JS bundle tải 1 lần, sau đó chỉ gọi API JSON) |
| **SEO** | Tuyệt vời (HTML sẵn cho crawler) | Kém (Crawler khó đọc JS-rendered content) |
| **Offline Support** | Không thể (Phụ thuộc server) | Tốt (Có thể cache app shell & data) |
| **Phù hợp cho** | Blog, landing page, e-commerce, trang cần SEO | Dashboard, chat app, SaaS, ứng dụng interactive cao |

#### Đánh Giá Ưu & Nhược Điểm

* **Server Side Rendering (SSR):**
  * **Ưu điểm:** Tốc độ hiển thị lần đầu (FCP) nhanh vượt trội; SEO tuyệt vời; hiển thị tốt trên thiết bị cấu hình yếu.
  * **Nhược điểm:** Server chịu tải nặng (100.000 người = 100.000 lần render); gặp hiện tượng Uncanny Valley (thấy nút nhưng bấm chưa được do chờ Hydration); mỗi lần chuyển trang là round-trip đến server.
* **Client Side Rendering (CSR):**
  * **Ưu điểm:** Trải nghiệm người dùng (UX) cực kỳ mượt mà sau lần load đầu; giảm tải server (server chỉ phục vụ static bundle & API JSON); hỗ trợ Offline tốt (cache app shell & data).
  * **Nhược điểm:** Lần load đầu chậm (JS bundle lớn 500KB+); SEO kém; phụ thuộc hoàn toàn vào JavaScript (tắt JS hoặc lỗi là trắng trang).

> 🎯 **Kết luận:** Không có winner tuyệt đối, chỉ có đúng context. SSR thắng ở tốc độ hiển thị đầu và SEO. CSR thắng ở trải nghiệm tương tác. Câu trả lời đúng luôn là: **phụ thuộc vào bài toán của bạn** *(hoặc giải pháp hiện đại: kết hợp Hybrid Rendering với Next.js / Remix)*.

---

### 2. SPA vs MPA (Kiến Trúc Ứng Dụng Web)

> 💡 **Lưu ý quan trọng:** **SSR / CSR** nói về **CÁCH RENDER** (Server hay Client dựng HTML). Còn **SPA / MPA** nói về **KIẾN TRÚC ỨNG DỤNG** (1 trang hay nhiều trang). Đừng bao giờ nhầm lẫn hai khái niệm này.

#### Bảng So Sánh SPA vs MPA

| Tiêu chí | SPA (Single Page Application) | MPA (Multi Page Application) |
| :--- | :--- | :--- |
| **Số trang HTML** | **1 HTML duy nhất** + Client JS Router | **N trang HTML** riêng biệt từ server |
| **Khi user click "About"** | Content fade out → fade in nội dung mới. URL đổi nhưng trang **KHÔNG reload**. Header, sidebar giữ nguyên | **Flash trắng toàn màn hình** → trang **MỚI hoàn toàn** load từ đầu. Tất cả elements render lại |
| **Tốc độ chuyển trang** | **~50ms** – gần như tức thì | **~800ms** – phải chờ server response + full reload |
| **Cơ chế hoạt động** | 1 HTML + JS Router – chỉ thay đổi phần cần thay đổi | N HTMLs + Server render – mỗi trang là một request mới |
| **Ví dụ thực tế** | Gmail, Figma, Notion, Facebook Web, Trello | Wikipedia, Trang tin tức (VnExpress, BBC), E-commerce truyền thống |

* **SPA (Single Page Application)**: Chỉ tải **MỘT trang HTML duy nhất**. Sau đó mọi điều hướng, mọi thay đổi nội dung đều do JavaScript xử lý. Không reload. Không flash trắng. Trải nghiệm mượt mà như Native App.
* **MPA (Multi Page Application)**: Kiểu truyền thống. Mỗi URL là một trang HTML riêng từ server. Click link đồng nghĩa với full page reload.
* **Hybrid Rendering (Xu hướng hiện đại)**: Kết hợp cả hai (Next.js, Remix) – Trang cần SEO dùng SSR, trang cần interactive dùng CSR trong kiến trúc SPA.

---

### 3. Tư Duy Imperative vs Declarative & React Virtual DOM

#### Vanilla JS (Imperative - Chỉ đạo từng bước)
* Phải tự tìm element $\rightarrow$ tự tạo node $\rightarrow$ tự chèn DOM $\rightarrow$ tự cập nhật state.
* Nhiều thao tác nhỏ trực tiếp vào DOM thật làm trình duyệt liên tục thực hiện **Reflow & Repaint** rất tốn tài nguyên CPU/GPU.

#### React (Declarative - Mô tả đích đến)
* Developer chỉ cần định nghĩa: *"Đây là UI tương ứng với State S"*.
* Khi State thay đổi, React tạo cây **Virtual DOM** mới, so sánh với Virtual DOM cũ (**Reconciliation** / thuật toán Diffing) và thực hiện **Batch Update** duy nhất những phần thay đổi vào DOM thật.

---

### 4. Tooling Modern: React, Vite, pnpm

* **React là gì?**: React là một **Thư viện (Library)** UI, không phải Framework full-stack. React tập trung làm tốt 1 việc: xây dựng UI dựa trên State.
* **Vite vs Webpack (CRA)**:
  * *Create React App (Webpack)*: Bundle TOÀN BỘ ứng dụng trước khi dev server chạy $\rightarrow$ Khởi động chậm ($\sim 8\text{s}$).
  * *Vite*: Sử dụng **Native ES Modules** trực tiếp của trình duyệt $\rightarrow$ Khởi động tức thì ($\sim 300\text{ms}$), HMR (Hot Module Replacement) siêu nhanh.
* **pnpm vs npm**:
  * *npm*: Copy vật lý thư viện vào từng thư mục `node_modules` $\rightarrow$ Tốn dung lượng đĩa.
  * *pnpm*: Lưu package trong **Global Store** duy nhất trên máy và dùng **Hard Links** $\rightarrow$ Tiết kiệm $\sim 90\%$ dung lượng ổ cứng, cài đặt nhanh gấp 2-3 lần.

---

### 5. Cấu Trúc Dự Án Vite & Luồng Khởi Chạy (Mount Flow)

#### Luồng Khởi Chạy
```
index.html (Thẻ vỏ <div id="root">) 
   └─> main.jsx (Gọi createRoot & render)
        └─> App.jsx (Component Gốc)
             └─> components/ (UI Con)
```

#### Quy Tắc Tổ Chức Folder
* **Dự án nhỏ/vừa (Group by Type)**: Chia thư mục theo loại file: `components/`, `hooks/`, `utils/`, `pages/`.
* **Dự án lớn (Group by Feature)**: Chia thư mục theo tính năng: `features/auth/`, `features/dashboard/`, `shared/` (Tiết kiệm thời gian tìm kiếm file, dễ maintain & scale).

---

### 6. Tiến Hóa Component: Class Component vs Function Component

#### Class Component (Di sản lịch sử)
* Dùng `class ComponentName extends React.Component`.
* Phải quản lý state trong `this.state` và cập nhật bằng `this.setState`.

#### 3 Nỗi Đau Chí Mạng Của Class Component:
1. **Rắc rối với con trỏ `this`**: Quên bind `this` trong constructor $\rightarrow$ `this` bị `undefined` $\rightarrow$ Crash ứng dụng.
2. **Lifecycle Hell**: Logic của một tính năng (ví dụ Chat Realtime) bị xé nhỏ ra 3 nơi: `componentDidMount` (kết nối), `componentDidUpdate` (cập nhật), `componentWillUnmount` (dọn dẹp).
3. **Boilerplate Code**: Code dài dòng, nhiều cú pháp thừa không liên quan trực tiếp đến business logic.

#### Function Component + Hooks (Chuẩn Hiện Đại)
* Viết dưới dạng Function đơn thuần.
* Dùng **Hooks** (`useState`, `useEffect`) để thay thế toàn bộ State và Lifecycle.
* **`useEffect`** cho phép gom toàn bộ logic (kết nối + dọn dẹp) của MỘT tính năng vào duy nhất một chỗ, giúp code ngắn gọn, rõ ràng và dễ bảo trì hơn $\sim 60\%$.
