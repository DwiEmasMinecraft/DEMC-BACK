const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose')

const app = express();

const routesDirectory = path.join(__dirname, 'routes');

module.exports = await mongoose.connect(process.env.MONGODB_URI);

function loadRoutes(directory, prefix) {
    fs.readdirSync(directory).forEach(file => {
      const fullPath = path.join(directory, file);
      let routePath = path.join(prefix, file.split('.')[0]);

      if (fs.lstatSync(fullPath).isDirectory()) {
        if (!fullPath.includes('/cdn')) {
            loadRoutes(fullPath, routePath);
        }
      } else {
        console.log(routePath)
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

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected To MongoDB!')
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});