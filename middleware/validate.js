const {
  productSchema,
  categorySchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  userSettingsSchema
} = require('./schemas');
const ExpressError = require('../utils/ExpressError');

module.exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    req.errorMessage = msg;
    next();
  } else {
    next();
  }
};

module.exports.validateReset = (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    req.errorMessage = msg;
    next();
  } else {
    next();
  }
};

module.exports.validateSettings = (req, res, next) => {
  const { error } = userSettingsSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    req.errorMessage = msg;
    next();
  } else {
    next();
  }
};
