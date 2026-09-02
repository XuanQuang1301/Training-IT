const express = require('express');
const { Pool } = require('pg');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/demodb';

const pool = new Pool({
  connectionString: connectionString
});

let isDbConnected = false;

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
      console.log('[DB] Đã kiểm tra và khởi tạo bảng "notes" thành công trong PostgreSQL.');
      return;
    } catch (err) {
      retries -= 1;
      console.error(`[DB Error] Chưa thể kết nối PostgreSQL (${err.message}). Đang thử lại sau ${delay / 1000}s... (Còn ${retries} lần thử)`);
      if (retries > 0) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
}

initDB();

app.get('/', (req, res) => {
  res.json({
    message: 'Chào mừng bạn đến với ứng dụng Demo Docker Backend (PostgreSQL)!',
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/users', (req, res) => {
  const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', role: 'Developer' },
    { id: 2, name: 'Trần Thị B', role: 'Designer' },
    { id: 3, name: 'Lê Văn C', role: 'DevOps Engineer' }
  ];
  res.json({
    success: true,
    data: mockUsers
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    hostname: os.hostname(),
    dbConnected: isDbConnected
  });
});

app.post('/api/notes', async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({ error: 'Chưa kết nối được đến Database PostgreSQL' });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Trường content là bắt buộc' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notes (content) VALUES ($1) RETURNING *;',
      [content]
    );
    res.status(201).json({
      success: true,
      message: 'Đã tạo note thành công trong PostgreSQL',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/notes', async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({ error: 'Chưa kết nối được đến Database PostgreSQL' });
  }

  try {
    const result = await pool.query('SELECT * FROM notes ORDER BY created_at DESC;');
    res.json({
      success: true,
      count: result.rowCount,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
