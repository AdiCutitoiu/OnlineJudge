const express = require("express");
const authenticationRouter = require("./authenticationRouter");
const problemRouter = require("./problemRouter");
const userRouter = require("./userRouter");
const submissionRouter = require("./submissionRouter");
const articleRouter = require("./articleRouter");
const authorize = require("../middleware/authorize");
const passport = require("passport");

class MainRouter {
  constructor() {
    const router = express.Router();

    router.use("/auth", authenticationRouter.router);
    router.use(
      "/users",
      passport.authenticate("jwt", { session: false }),
      authorize.normal,
      userRouter.router,
    );
    router.use(
      "/challenges",
      passport.authenticate("jwt", { session: false }),
      authorize.normal,
      problemRouter.router,
    );
    router.use(
      "/articles",
      passport.authenticate("jwt", { session: false }),
      authorize.normal,
      articleRouter.router,
    );
    router.use(
      "/submissions",
      passport.authenticate("jwt", { session: false }),
      authorize.normal,
      submissionRouter.router,
    );

    this.router = router;
  }
}

module.exports = new MainRouter();
