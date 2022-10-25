const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getUser = (req, res, next) => {
  res.render('user/index', {
    pageTitle: 'Cart',
    path: '/user',
  });
};

exports.getSignIn = (req, res, next) => {
  res.render('user/signin', {
    pageTitle: 'Sign In',
    path: '/user/signin',
  });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('user/orders', {
        path: '/user/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect('/user/orders');
    })
    .catch((err) => console.log(err));
};
