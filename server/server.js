const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const mainRouter = require('./src/routers/mainRouter');
const passport = require('./src/util/passport');

mongoose.connect('mongodb://onlinejudge:caphyon2018@ds021016.mlab.com:21016/onlinejudge', (err) => {
  if (err) {
    console.log('Database connection failed');
    throw err;
  }

  const server = express();

  server.use(morgan('combined'));
  server.use(bodyParser.json());
  server.use(passport.initialize());
  server.use('/', mainRouter);

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
