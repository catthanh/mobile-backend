const Joi = require("joi");

const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
});

const logInSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

module.exports = { authSchema, logInSchema };
