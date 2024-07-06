import Joi from 'joi';
import {
  CONTACT_TYPE_LIST,
  PHONE_PATTERN,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PHONE_NUMBER_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
} from '../constants/contact-constants.js';

export const createContactSchema = Joi.object({
  name: Joi.string()
    .min(NAME_MIN_LENGTH)
    .max(NAME_MAX_LENGTH)
    .required()
    .messages({
      'string.base': `"name" must be a string`,
      'string.empty': `"name" cannot be empty`,
      'string.min': `"name" must have at least ${NAME_MIN_LENGTH} characters`,
      'string.max': `"name" must have at most ${NAME_MAX_LENGTH} characters`,
      'any.required': `"name" is a required field`,
    }),
  phoneNumber: Joi.string()
    .min(PHONE_NUMBER_MIN_LENGTH)
    .max(PHONE_NUMBER_MAX_LENGTH)
    .pattern(PHONE_PATTERN)
    .required()
    .messages({
      'string.pattern.base': `"phoneNumber" must match the phone number pattern`,
      'string.empty': `"phoneNumber" cannot be empty`,
      'string.min': `"phoneNumber" must have at least ${PHONE_NUMBER_MIN_LENGTH} characters`,
      'string.max': `"phoneNumber" must have at most ${PHONE_NUMBER_MAX_LENGTH} characters`,
      'any.required': `"phoneNumber" is a required field`,
    }),
  email: Joi.string().email().messages({
    'string.email': `"email" must be a valid email`,
  }),
  isFavourite: Joi.boolean().default(false).messages({
    'boolean.base': `"isFavourite" must be a boolean value`,
  }),
  contactType: Joi.string()
    .valid(...CONTACT_TYPE_LIST)
    .default(CONTACT_TYPE_LIST[0])
    .required()
    .messages({
      'any.only': `"contactType" must be one of the following values: ${CONTACT_TYPE_LIST}`,
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string()
    .min(NAME_MIN_LENGTH)
    .max(NAME_MAX_LENGTH)
    .messages({
      'string.base': `"name" must be a string`,
      'string.empty': `"name" cannot be empty`,
      'string.min': `"name" must have at least ${NAME_MIN_LENGTH} characters`,
      'string.max': `"name" must have at most ${NAME_MAX_LENGTH} characters`,
    }),
  phoneNumber: Joi.string()
    .min(PHONE_NUMBER_MIN_LENGTH)
    .max(PHONE_NUMBER_MAX_LENGTH)
    .pattern(PHONE_PATTERN)
    .messages({
      'string.pattern.base': `"phoneNumber" must match the phone number pattern`,
      'string.empty': `"phoneNumber" cannot be empty`,
      'string.min': `"phoneNumber" must have at least ${PHONE_NUMBER_MIN_LENGTH} characters`,
      'string.max': `"phoneNumber" must have at most ${PHONE_NUMBER_MAX_LENGTH} characters`,
    }),
  email: Joi.string().email().messages({
    'string.email': `"email" must be a valid email`,
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': `"isFavourite" must be a boolean value`,
  }),
  contactType: Joi.string()
    .valid(...CONTACT_TYPE_LIST)
    .messages({
      'any.only': `"contactType" must be one of the following values: ${CONTACT_TYPE_LIST}`,
    }),
});
