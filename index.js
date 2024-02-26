const mongoose = require('mongoose');
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const app = express();
const routesDirectory = path.join(__dirname, 'routes');

app.use(express.json())

function print (path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split (thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

async function startServer() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected To MongoDB!')

  function loadRoutes(directory, prefix) {
    fs.readdirSync(directory).forEach(file => {
      const fullPath = path.join(directory, file);
      let routePath = path.join(prefix, file.split('.')[0]);

      if (fs.lstatSync(fullPath).isDirectory()) {
        if (!fullPath.includes('/cdn')) {
            loadRoutes(fullPath, routePath);
        }
      } else {
        const route = require(fullPath);
        if (file === 'root.js') {
          routePath = prefix;
        }
        app.use(routePath, route);
      }
    });
  }  

  app.use('/cdn', express.static(path.join(routesDirectory, 'cdn')));

  loadRoutes(routesDirectory, '/');

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
    app._router.stack.forEach(print.bind(null, []))
  });
}

startServer();

module.exports = mongoose;