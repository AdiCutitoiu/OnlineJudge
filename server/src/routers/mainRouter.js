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
    this.router = router;

    router.use("/auth", authenticationRouter.router);
    this.link("/users", userRouter);
    this.link("/challenges", problemRouter);
    this.link("/articles", articleRouter);
    this.link("/submissions", submissionRouter);
  }

  link(route, subrouter) {
    this.router.use(
      route,
      passport.authenticate("jwt", { session: false }),
      authorize.normal,
      subrouter.router,
    );
  }
}

module.exports = new MainRouter();
