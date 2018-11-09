module.exports = {
  create: function(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
  
    return error;
  }
};
