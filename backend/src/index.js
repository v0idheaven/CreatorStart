import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const log = (level, msg, meta = {}) => {
  const entry = { timestamp: new Date().toISOString(), level, message: msg, ...meta };
  console.log(JSON.stringify(entry));
}

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    log('info', 'Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${Date.now() - start} ms`,
    });
  });
  next();
});

app.get('/ping', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CreatorStart backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use((res, req) => {
  log('warn', '404 Not Found', {path: req.path});
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
  });
})

app.use((err, req, res, next) => {
  log('error', 'Uncatched error', {
    message: err.message,
    stack: err.stack,
  })
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  log('info', 'Server started', { port: PORT });
});