import Joi from 'joi';
import {
  emailPattern,
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
} from '../constants/user-constants.js';

export const registerUserSchema = Joi.object({
  name: Joi.string()
    .min(USER_NAME_MIN_LENGTH)
    .max(USER_NAME_MAX_LENGTH)
    .required()
    .messages({
      'string.base': `"name" must be a string`,
      'string.empty': `"name" cannot be empty`,
      'string.min': `"name" must have at least ${USER_NAME_MIN_LENGTH} characters`,
      'string.max': `"name" must have at most ${USER_NAME_MAX_LENGTH} characters`,
      'any.required': `"name" is a required field`,
    }),
  email: Joi.string().pattern(emailPattern).required().messages({
    'string.email': `"email" must be a valid email`,
    'any.required': `"email" is a required field`,
  }),
  password: Joi.string().required().messages({
    'any.required': `"password" is a required field`,
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
  password: Joi.string().required(),
});
