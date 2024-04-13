const express = require('express');
const mongoose = require(process.env.mainFile).mongoose;
const router = express.Router();
const Users = require(process.env.schemas);
const jwt = require('jsonwebtoken');

router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const auth = req.headers.authentication;

});

module.exports = router;