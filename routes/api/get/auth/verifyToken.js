const express = require("express");
const mongoose = require(process.env.mainFile).mongoose;
const router = express.Router();
const Users = require(process.env.schemas);
const verifyToken = require(process.env.authFile).verifyToken;
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  let token = req.headers.authorization;
  if (!token) {
    res.sendStatus(403);
  }
  token = token.split("Bearer ")[1];
  console.log(await verifyToken(token, req.ip));
});

module.exports = router;
