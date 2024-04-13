const mongoose = require(process.env.mainFile).mongoose;
const db = require(process.env.mainFile).db;
const Users = require(process.env.schemas);
const jwt = require('jsonwebtoken');


function getToken(id, auth, ip) {
    if (mongoose.isValidObjectId(id)) {
        Users.findById(id)
            .then(user => {
                if (!user) { res.sendStatus(404); return; }
                if (user.httpauth == auth) {
                    let tkn = jwt.sign({ userId: id }, process.env.key)
                    db.run(`INSERT INTO tokens(token, ip) VALUES(?, ?)`, [tkn, ip], (err) => {
                        if (err) {
                            console.error(err.message);
                            res.status(500).send(err.message);
                            return;
                        }
                    });
                    res.send(tkn)
                } else {
                    res.sendStatus(401);
                }
            })
    } else {
        Users.findOne({ username: id })
            .then(user => {
                if (!user) { res.sendStatus(404); return; }
                if (user.httpauth == auth) {
                    let tkn = jwt.sign({ userId: id }, process.env.key)
                    db.run(`INSERT INTO tokens(token, ip) VALUES(?, ?)`, [tkn, ip], (err) => {
                        if (err) {
                            console.error(err.message);
                            res.status(500).send(err.message);
                            return;
                        }
                    });
                    res.send(tkn)
                } else {
                    res.sendStatus(401);
                }
            })
    }
}

module.exports = getToken;