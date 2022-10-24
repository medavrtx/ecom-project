const Product = require('../models/product');

exports.getUser = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('user/index', {
      pageTitle: 'Cart',
      path: '/user',
      products: products.reverse(),
    });
  });
};

exports.getSignIn = (req, res, next) => {
  res.render('user/signin', {
    pageTitle: 'Sign In',
    path: '/user/signin',
  });
};

exports.getOrders = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('user/orders', {
      pageTitle: 'Orders',
      path: '/user/orders',
      products: products.reverse(),
    });
  });
};
