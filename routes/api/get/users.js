const express = require('express');
const mongoose = require(process.env.mainFile);
const router = express.Router();
const Users = require(process.env.schemas)
const jwt = require('jsonwebtoken');

router.get('/:id', (req, res) => {
    const userId = req.params.id;
    let sensetivity = req.headers.sensetivity || 0
    //profileOnly = 0, loginOnly = 1, full = 2
    if (!req.headers.authorization && sensetivity != 0) {
        res.sendStatus(401); 
        return; 
    } else {
        if (sensetivity != 0) {
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
    }
    
    Users.findById(userId)
    .then((doc) => {
        let user = doc.toObject();
        if (sensetivity == 0) { delete user['password']; delete user['TOTPSecret']; }
        if (sensetivity == 1) { delete user['username']; delete user['role']; delete user['badges']; }
        res.send(user);
    }).catch((error) => {
        console.error('Error: ' + error)
        res.status(400).send(error.toString());    
    })
});

module.exports = router;
