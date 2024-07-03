const sqlite3 = require("sqlite3");

let db = new sqlite3.Database("./tokens.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the tokens database.");
});

function stuff(token) {
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
}

console.log(
  stuff(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjAxN2VjMjNiOTc4NmRiYjY2Y2U2ODQiLCJpYXQiOjE3MTU5NTI5MTV9.hy-WobLwtjkzVfTSV_wR48qCK8nggKAqqGwtFdnhHy4"
  )
);
