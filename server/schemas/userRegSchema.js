const Joi = require("joi");

const userRegSchema = Joi.object().keys({
  name: Joi.string().min(4).required(),
  email: Joi.string()
    .pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
    .required(),
  password: Joi.string().required(),
});

module.exports = userRegSchema;
