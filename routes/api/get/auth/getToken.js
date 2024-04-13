const express = require('express');
const mongoose = require(process.env.mainFile).mongoose;
const router = express.Router();
const Users = require(process.env.schemas);
const getToken = require(process.env.authFile);
const jwt = require('jsonwebtoken');

router.get('/:id', (req, res) => {
    if (!req.headers.authorization) {
        res.status(400).send('no authentication sent');
        return;
    }
    getToken(req.params.id, req.headers.authorization, req.ip)
});

module.exports = router;