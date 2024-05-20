const express = require("express");
const mongoose = require(process.env.mainFile).mongoose.mongoose;
const router = express.Router();
const Users = require(process.env.schemas);
const jwt = require("jsonwebtoken");

router.get("/:id", (req, res) => {
  const userId = req.params.id;
  Users.findById(userId)
    .then((doc) => {
      let user = doc.toObject();
      delete user["password"];
      delete user["TOTPSecret"];
      delete user["httpauth"];
      res.send(user);
    })
    .catch((error) => {
      console.error("Error: " + error);
      res.status(400).send(error.toString());
    });
});

module.exports = router;
