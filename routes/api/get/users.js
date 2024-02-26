const express = require('express');
const mongoose = require(process.env.mainFile);
const router = express.Router();
const Users = require(process.env.schemas)

router.get('/:id', (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    if (req.headers.sensetivity) {
        const sensetivity = req.headers.sensetivity
        //profileOnly = 0, loginOnly = 1, full = 2
    }
    Users.findById(userId)
    .then((user) => {
        res.send(user);
      })
});

module.exports = router;
