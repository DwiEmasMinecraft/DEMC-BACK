const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('My brother in christ where are you going? /api or /cdn ?');
});

module.exports = router;
