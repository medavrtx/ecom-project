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
  title: Joi.string().required().min(1),
  price: Joi.number().required().min(0),
  description: Joi.string().required().min(1).max(400),
  image: Joi.string(),
  productId: Joi.string(),
  _csrf: Joi.string(),
  deleteImage: Joi.string()
});

module.exports.categorySchema = Joi.object({
  title: Joi.string().required(),
  _csrf: Joi.string()
});
