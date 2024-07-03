const express = require('express');
const mongoose = require(process.env.mainFile).mongoose;
const router = express.Router();

router.get('/', (req, res) => {
  res.send(JSON.stringify({
    'database': mongoose.connection.readyState
  }));
});

module.exports = router;
