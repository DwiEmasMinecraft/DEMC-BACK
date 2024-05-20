const express = require("express");
const mongoose = require(process.env.mainFile).mongoose;
const router = express.Router();
const Users = require(process.env.schemas);
const getToken = require(process.env.authFile).getToken;
const jwt = require("jsonwebtoken");

router.get("/:id", async (req, res) => {
  if (!req.headers.authorization) {
    res.status(400).send("no authentication sent");
    return;
  }
  auth = await getToken(req.params.id, req.headers.authorization, req.ip);
  if (auth.code != 200) {
    res.status(auth.code).send(auth.res);
  } else {
    res.send(auth.res);
  }
});

module.exports = router;
