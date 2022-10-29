const Order = require('../models/order');

exports.getUser = (req, res, next) => {
  res.render('user/index', {
    pageTitle: 'Cart',
    path: '/user',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('user/orders', {
        path: '/user/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => console.log(err));
};
