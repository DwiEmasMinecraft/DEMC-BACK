const express = require('express');
const mongoose = require(process.env.mainFile).mongoose;
const router = express.Router();
const Users = require(process.env.schemas);
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    let token = req.headers.authorization
    if (!token) { res.sendStatus(403); }
    token = token.split('Bearer ')[1];
    try {
        const decoded = jwt.verify(token, process.env.key);
        Users.findById(decoded.userId)
            .then(user => {
                res.send(user._id)
            })
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;