const express = require('express');
const mongoose = require(process.env.mainFile);
const router = express.Router();
const Users = require(process.env.schemas)

router.post('/', async (req, res) => {
    let exists = await Users.findOne({ username: req.body.username })
    if (exists) {
        res.status(400).send('Username taken');
        return;
    }
    try {
        const newUser = new Users({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role || 'user',
            badges: [`${((req.body.role == 'admin') ? 'DEMC Crew' : '')}`]
        })
        newUser.save()
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
});

module.exports = router;
