const express = require('express');
const mongoose = require(process.env.mainFile);
const router = express.Router();
const Users = require(process.env.schemas)
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    let exists = await Users.findOne({ username: req.body.username })
    if (exists) {
        res.status(400).send('Username taken');
        return;
    }
    if (req.body.role == 'admin') {
        if (!req.headers.authorization) { res.sendStatus(401); return; }
        const auth = req.headers.authorization.split('Bearer ')[1]
        const decoded = jwt.verify(auth, process.env.key);
        Users.findById(decoded.userId)
        .then(user => {
            if (user.role != 'admin') {
                res.sendStatus(401)
                return;
            }
        })
    }
    try {
        const newUser = new Users({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role || 'user',
            badges: [`${((req.body.role == 'admin') ? 'DEMC Crew' : '')}`]
        })
        newUser.save()
        const user = newUser.toObject()
        delete user['password']; delete user['TOTPSecret']
        res.send(user)
    } catch (err) {
        console.error(err)
        res.status(500).send(err)
    }
});

module.exports = router;
