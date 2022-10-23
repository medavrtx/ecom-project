const Cart = require('../models/cart');
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
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      let totalQty = 0;
      cart.products.forEach((e) => {
        totalQty += e.qty;
      });
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
        totalPrice: cart.totalPrice,
        totalQty: totalQty,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
    res.redirect('/cart');
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

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
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
