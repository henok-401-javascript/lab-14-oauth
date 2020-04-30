'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routerHander = require('./routes/auth-routes.js');
const app = express();

app.use(morgan('div'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res, next) => {
  res.send('HOME PAGE!!');
});

app.use(routerHander);

const expressListner = (PORT) => {
  app.listen(PORT, () => {
    console.log('server is up', PORT);
  });
};

module.exports = {
  server: app,
  start: expressListner,
};
