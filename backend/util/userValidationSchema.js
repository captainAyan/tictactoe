const Joi = require("joi");

const USER_USERNAME_MAX_LENGTH = 100;
const USER_PASSWORD_MIN_LENGTH = 6;
const USER_PASSWORD_MAX_LENGTH = 200;

const createSchema = Joi.object({
  username: Joi.string()
    .min(1)
    .max(USER_USERNAME_MAX_LENGTH)
    .lowercase()
    .required(),
  password: Joi.string()
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
});

const editSchema = Joi.object({
  username: Joi.string()
    .min(1)
    .max(USER_USERNAME_MAX_LENGTH)
    .lowercase()
    .required(),
});

const passwordChangeSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
});

module.exports = { createSchema, editSchema, passwordChangeSchema };
