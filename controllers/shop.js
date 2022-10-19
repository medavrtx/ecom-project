const Product = require('../models/product');

exports.getHome = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/home', {
      pageTitle: 'ECOM',
      path: '/',
      products: products.reverse(),
    });
  });
};

exports.getInfo = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/info', {
      pageTitle: 'Info',
      path: '/info',
      products: products.reverse(),
    });
  });
};

exports.getCart = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      products: products.reverse(),
    });
  });
};

exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
      products: products.reverse(),
    });
  });
};

exports.getUser = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      products: products.reverse(),
    });
  });
};

exports.getSignIn = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/signin', {
      pageTitle: 'Sign In',
      path: '/signin',
      products: products.reverse(),
    });
  });
};
