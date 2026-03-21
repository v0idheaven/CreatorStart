import express from 'express';

const router = express.Router();

// GET /api/user/me
router.get('/me', (req, res) => {
  res.json({
    message: 'User route working',
  });
});

export default router;