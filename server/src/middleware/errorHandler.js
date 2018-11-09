module.exports = function (err, req, res, next) {
  if (err.statusCode) {
    res
      .status(err.statusCode)
      .json({ error: err.message });
  } else {
    console.error(new Error().stack);
    res.status(500).end();
  }
}