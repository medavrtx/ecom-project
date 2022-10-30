const User = require('../models/user');
const Order = require('../models/order');

exports.getLogIn = (req, res, next) => {
  res.render('user/login', {
    pageTitle: 'Sign In',
    path: '/user/login',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getRegistration = (req, res, next) => {
  res.render('user/registration', {
    pageTitle: 'Create Account',
    path: '/registration',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.postLogIn = (req, res, next) => {
  User.findById('635c660210f1950b671dc5df').then((user) => {
    req.session.isLoggedIn = true;
    req.session.isAdmin = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      res.redirect('/');
    });
  });
};

exports.postRegistration = (req, res, next) => {
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const address1 = req.body.address1;
  const address2 = req.body.address2;
  const city = req.body.city;
  const state = req.body.state;
  const zipCode = req.body.zipCode;
  const country = req.body.country;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect('/signup');
      }
      const user = new User({
        email: email,
        password: password,
        name: `${firstName} ${lastName}`,
        address: `${address1}, ${address2}, ${city}, ${state} ${zipCode}`,
        country: country,
        phoneNumber: phoneNumber,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => console.log(err));
  res.redirect('/');
};

exports.getUser = (req, res, next) => {
  res.render('user/index', {
    pageTitle: 'Cart',
    path: '/user',
    user: req.user,
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
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => console.log(err));
};
