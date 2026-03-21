import express from 'express';

const router = express.Router();

// GET /api/planner
router.get('/', (req, res) => {
  res.json({
    message: 'Planner fetched',
  });
});

// POST /api/planner
router.post('/', (req, res) => {
  const data = req.body;

  res.json({
    message: 'Planner saved',
    data,
  });
});

export default router;