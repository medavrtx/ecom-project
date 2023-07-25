const BaseJoi = require('joi');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        if (clean !== value) {
          return helpers.error('string.escapeHTML', { value });
        }
        return clean;
      }
    }
  }
});

const Joi = BaseJoi.extend(extension);

module.exports.productSchema = Joi.object({
  title: Joi.string().trim().required().min(1),
  price: Joi.number().required().min(0),
  description: Joi.string().trim().required().min(1).max(400),
  image: Joi.string(),
  productId: Joi.string(),
  _csrf: Joi.string(),
  deleteImage: Joi.string()
});

module.exports.categorySchema = Joi.object({
  title: Joi.string().required(),
  _csrf: Joi.string()
});

module.exports.loginSchema = Joi.object({
  email: Joi.string().trim().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().trim().required().messages({
    'any.required': 'Password is required'
  }),
  _csrf: Joi.string()
});

module.exports.registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email.',
    'any.required': 'Email is required.'
  }),
  firstName: Joi.string().min(1).trim().required(),
  lastName: Joi.string().min(1).trim().required(),
  password: Joi.string().min(5).trim().required().messages({
    'string.min': 'Please enter a password with at least 5 characters.',
    'any.required': 'Password is required.'
  }),
  confirmPassword: Joi.string()
    .trim()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords have to match.',
      'any.required': 'Confirm password is required.'
    }),
  agreement: Joi.boolean().truthy('on').required().messages({
    'boolean.base': 'Invalid value for agreement. Please check the checkbox.',
    'any.required':
      'Please agree to the terms by checking the agreement checkbox before submitting the form.'
  }),
  _csrf: Joi.string()
});

module.exports.resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email.',
    'any.required': 'Email is required.'
  }),
  currentPassword: Joi.string().min(5).trim().required().messages({
    'string.min': 'Please enter a password with at least 5 characters.',
    'any.required': 'Password is required.'
  }),
  newPassword: Joi.string().min(5).trim().required().messages({
    'string.min': 'Please enter a password with at least 5 characters.',
    'any.required': 'New password is required.'
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords have to match.',
      'any.required': 'Confirm password is required.'
    }),
  _csrf: Joi.string()
});

module.exports.userSettingsSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email.',
    'any.required': 'Email is required.'
  }),
  firstName: Joi.string().min(1).trim().required().messages({
    'string.min': 'Please enter a valid name.',
    'string.empty': 'First name is not allowed to be empty.',
    'any.required': 'First name is required.'
  }),
  lastName: Joi.string().min(1).trim().required().messages({
    'string.min': 'Please enter a valid name.',
    'string.empty': 'Last name is not allowed to be empty.',
    'any.required': 'Last name is required.'
  }),
  password: Joi.string().min(5).trim().required().messages({
    'string.min': 'Please enter a password with at least 5 characters.',
    'string.empty': 'Password is not allowed to be empty.',
    'any.required': 'Password is required.'
  }),
  _csrf: Joi.string()
});
