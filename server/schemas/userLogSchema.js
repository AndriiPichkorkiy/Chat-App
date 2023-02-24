const Joi = require("joi");

const userLogSchema = Joi.object().keys({
  email: Joi.string()
    .pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
    .required(),
  password: Joi.string().required(),
});

module.exports = userLogSchema;
