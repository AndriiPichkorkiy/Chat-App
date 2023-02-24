const RequestError = require("../helpers/RequestError");

function validateBody(schema) {
  return function (req, res, next) {
    const { error } = schema.validate(req.body);
    if (error) next(RequestError(400, error.message));
    else next();
  };
}

module.exports = validateBody;
