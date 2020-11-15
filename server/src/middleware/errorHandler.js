class ErrorHandler {
  handleError = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.status ? err.message : "Something went wrong";

    res.status(status).json({ error: message });

    if (!err.status) {
      console.log(err.stack);
    }
  };
}

module.exports = new ErrorHandler();
