import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// routes
import userRoutes from './routes/user.routes.js';
import plannerRoutes from './routes/planner.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// CORS use for backend and frontend communication
app.use(cors());

// Parse JSON request body
app.use(express.json());

const log = (level, msg, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message: msg,
    ...meta,
  };
  console.log(JSON.stringify(entry));
};

// Request logging middleware
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CreatorStart backend is running',
    timestamp: new Date().toISOString(),
  });
});

// System status
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Feature routes
app.use('/api/user', userRoutes);
app.use('/api/planner', plannerRoutes);

// 404 error handler
app.use((req, res) => {
  log('warn', '404 Not Found', {
    method: req.method,
    path: req.path,
  });

  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  log('error', 'Unhandled error', {
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

// Start the server
app.listen(PORT, () => {
  log('info', 'Server started', { port: PORT });
});