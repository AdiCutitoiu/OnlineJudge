const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const mainRouter = require("./src/routers/mainRouter");
const config = require("./config");
const passport = require("./src/util/passport");
const errorHandler = 
  require("./src/middleware/errorHandler");

const authController = 
  require("./src/controllers/authenticationController");

const MONGOOSE_OPT = {
  useNewUrlParser: true,
  useCreateIndex: true,
};

class App {
  constructor() {
    this.server = express();
  }

  initialize = async () => {
    await mongoose.connect(config.dbString, MONGOOSE_OPT);

    const {adminCredentials} = config
    await authController.initializeAdmin(adminCredentials);

    this.server.use(cors());
    this.server.use(morgan("combined"));
    this.server.use(bodyParser.json());
    this.server.use(passport.initialize());
    this.server.use("/", mainRouter.router);
    this.server.use((err, req, res, next) =>
      errorHandler.handleError(err, req, res, next)
    );
  };

  run = () => {
    const port = process.env.PORT || 3000;
    this.server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  };
}

async function main() {
  const app = new App();
  await app.initialize();
  app.run();
}

main();
