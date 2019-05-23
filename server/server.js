const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const mainRouter = require('./src/routers/mainRouter');
const config = require('./config');
const passport = require('./src/util/passport');
const errorHandler = require('./src/middleware/errorHandler');

const authController = require('./src/controllers/authenticationController');

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true
};

async function main() {
  try {
    await mongoose.connect(config.dbString, mongooseOptions);
  } catch (error) {
    console.log(error);
  }

  await authController.initializeAdmin(config.adminCredentials);

  const server = express();

  server.use(cors());
  server.use(morgan('combined'));
  server.use(bodyParser.json());
  server.use(passport.initialize());
  server.use('/', mainRouter);
  server.use(errorHandler);

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

main();