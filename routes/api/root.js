const express = require('express');
const mongoose = require(process.env.mainFile);
const router = express.Router();

console.log(mongoose)

router.get('/', (req, res) => {
  mongoosePromise.then(mongoose => {
    res.send(JSON.stringify({
      'database': mongoose.connection.readyState
    }));
  });
});

module.exports = router;
