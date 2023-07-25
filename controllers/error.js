const ExpressError = require('../utils/ExpressError');

exports.get404 = (err, req, res, next) => {
  const { statusCode = 404 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong';
  res.status(statusCode).render('error', { err });
};

exports.get500 = (err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('error');
};
