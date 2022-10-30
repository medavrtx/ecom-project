const User = require('../models/user');
const Order = require('../models/order');
const bcrypt = require('bcryptjs');

exports.getLogIn = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('user/login', {
    pageTitle: 'Sign In',
    path: '/user/login',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    errorMessage: message,
  });
};

exports.getRegistration = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('user/registration', {
    pageTitle: 'Create Account',
    path: '/registration',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    errorMessage: message,
  });
};

exports.postLogIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }
    bcrypt.compare(password, user.password).then((doMatch) => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.isAdmin = user.isAdmin;
        req.session.user = user;
        return req.session.save((err) => {
          console.log(err);
          res.redirect('/');
        });
      }
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
  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      req.flash('error', 'E-Mail exists already, please pick a different one.');
      return res.redirect('/registration');
    }
    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
          address: `${address1}, ${address2}, ${city}, ${state} ${zipCode}`,
          country: country,
          phoneNumber: phoneNumber,
          isAdmin: false,
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
