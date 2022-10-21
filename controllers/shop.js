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

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/shop/' + product.id,
      product: product,
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
