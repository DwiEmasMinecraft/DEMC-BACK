const mongoose = require(process.env.mainFile).mongoose;
const db = require(process.env.mainFile).db;
const Users = require(process.env.schemas);
const jwt = require("jsonwebtoken");

async function verifyToken(token, ip) {
  try {
    const decoded = jwt.verify(token, process.env.key);
    return await Users.findById(decoded.userId).then((user) => {
      if (!user) {
        return { code: 404, res: "User Not Found" };
      }

      db.get(
        `SELECT token tkn, ip ipaddr FROM tokens WHERE token = ?`,
        [token],
        (err, row) => {
          if (err) {
            console.log(err);
            return { code: 500, res: err.message };
          }
          if (ipaddr != ip) {
            return { code: 409, res: "Token Invalidated." };
          }
          return { code: 200, res: "Authenticated." };
        }
      );
    });
  } catch (err) {
    return err;
  }
}

module.exports = { getToken, verifyToken };
