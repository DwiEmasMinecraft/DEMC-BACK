const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimiter = require("express-rate-limit");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
var ip = require("ip");

const router = express.Router();
const app = express();
app.use(cors());
const routesDirectory = path.join(__dirname, "routes");

const allowlist = ["::ffff:127.0.0.1"];

const rateLimit = rateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  skipFailedRequests: true,
  keyGenerator: (req, res) => req.ip,
  skip: (req, res) => allowlist.includes(req.ip),
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
    console.warn(`${req.ip} is getting rate-limited!`);
  },
});

app.use(rateLimit);
app.use(express.json());

let db = new sqlite3.Database("./tokens.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the tokens database.");
});

db.run(`CREATE TABLE IF NOT EXISTS tokens(token TEXT, ip TEXT)`, (err) => {
  if (err) {
    console.error(err.message);
  }
});

function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(
      print.bind(null, path.concat(split(layer.route.path)))
    );
  } else if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach(
      print.bind(null, path.concat(split(layer.regexp)))
    );
  } else if (layer.method) {
    console.log(
      "%s /%s",
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join("/")
    );
  }
}

function split(thing) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

async function startServer() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected To MongoDB!");

  function loadRoutes(directory, prefix) {
    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.join(directory, file);
      let routePath = path.join(prefix, file.split(".")[0]);

      if (fs.lstatSync(fullPath).isDirectory()) {
        if (!fullPath.includes("/cdn")) {
          loadRoutes(fullPath, routePath);
        }
      } else {
        const route = require(fullPath);
        if (file === "root.js") {
          routePath = prefix;
        }
        app.use(routePath, route);
      }
    });
  }

  app.use("/cdn", express.static(path.join(routesDirectory, "cdn")));

  loadRoutes(routesDirectory, "/");

  app.listen(process.env.port, () => {
    console.log("Server is running on port " + process.env.port);
    console.log(ip.address() + ":" + process.env.port);
    app._router.stack.forEach(print.bind(null, []));
  });
}

startServer();

module.exports = { mongoose, db };
