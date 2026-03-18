const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.get('/ping', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CreatorStart chl rha h',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});