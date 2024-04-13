const express = require('express');
const mongoose = require(process.env.mainFile).mongoose;
const router = express.Router();
const Users = require(process.env.schemas);
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    // Your route logic here
});

module.exports = router;