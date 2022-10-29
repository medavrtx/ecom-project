const Order = require('../models/order');

exports.getUser = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1];
  res.render('user/index', {
    pageTitle: 'Cart',
    path: '/user',
    isAuthenticated: isLoggedIn,
    isAdmin: req.isAdmin,
  });
};

exports.getOrders = (req, res, next) => {
  const isLoggedIn = req.get('Cookie')?.split('=')[1];
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('user/orders', {
        path: '/user/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: isLoggedIn,
        isAdmin: req.isAdmin,
      });
    })
    .catch((err) => console.log(err));
};
