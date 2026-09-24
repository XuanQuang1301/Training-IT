const express = require('express');
const { Pool } = require('pg');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Chuỗi kết nối PostgreSQL (mặc định trỏ tới demo-db:5432)
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@demo-db:5432/demodb';

const pool = new Pool({
  connectionString: connectionString
});

let isDbConnected = false;

// Tự động kết nối lại DB nếu container Postgres đang khởi động
async function initDB(retries = 10, delay = 3000) {
  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log(`[DB] Đã kết nối thành công đến PostgreSQL tại: ${connectionString}`);
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS notes (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      client.release();
      isDbConnected = true;
      console.log('[DB] Đã khởi tạo bảng "notes" thành công trong PostgreSQL.');
      return;
    } catch (err) {
      retries -= 1;
      console.error(`[DB Warning] Chưa thể kết nối PostgreSQL (${err.message}). Thử lại sau ${delay / 1000}s... (Còn ${retries} lần)`);
      if (retries > 0) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
}

initDB();

// Route 1: Trang chủ
app.get('/', (req, res) => {
  res.json({
    message: 'Chào mừng đến với Demo Docker CLI Manual Execution (Không dùng Docker Compose)!',
    hostname: os.hostname(),
    timestamp: new Date().toISOString(),
    dbConnectionString: connectionString
  });
});

// Route 2: Healthcheck Probe
app.get('/health', (req, res) => {
  res.json({
    status: isDbConnected ? 'healthy' : 'unhealthy',
    uptime: process.uptime(),
    hostname: os.hostname(),
    dbConnected: isDbConnected
  });
});

// Route 3: Lấy danh sách ghi chú từ DB
app.get('/api/notes', async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({ error: 'Chưa kết nối được đến Database PostgreSQL' });
  }

  try {
    const result = await pool.query('SELECT * FROM notes ORDER BY id DESC;');
    res.json({
      success: true,
      total: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route 4: Thêm ghi chú mới vào DB
app.post('/api/notes', async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({ error: 'Chưa kết nối được đến Database PostgreSQL' });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Trường content không được để trống' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notes (content) VALUES ($1) RETURNING *;',
      [content]
    );
    res.status(201).json({
      success: true,
      message: 'Đã lưu ghi chú thành công vào PostgreSQL!',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] App backend đang chạy tại port ${PORT}`);
});
