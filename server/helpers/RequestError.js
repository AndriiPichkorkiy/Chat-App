function RequestError(status = 500, message = "Server error") {
  const err = new Error(message);
  err.status = status;
  return err;
}

module.exports = RequestError;
