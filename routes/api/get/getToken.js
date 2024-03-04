const express = require('express');
const mongoose = require(process.env.mainFile);
const router = express.Router();
const Users = require(process.env.schemas);
const jwt = require('jsonwebtoken');

router.get('/:id', (req, res) => {
    res.send(jwt.sign({ userId: req.params.id }, process.env.key, { expiresIn: '1h'}))
});

module.exports = router;