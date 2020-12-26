const DEFAULT_MSG = "Something went wrong";
class ErrorHandler {
  // eslint-disable-next-line no-unused-vars
  handleError = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.status ? err.message : DEFAULT_MSG;

    res.status(status).json({ error: message });

    if (!err.status) {
      console.log(err.stack);
    }
  };
}

module.exports = new ErrorHandler();
