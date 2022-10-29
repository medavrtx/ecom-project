const User = require('../models/user');

exports.getLogIn = (req, res, next) => {
  res.render('user/signin', {
    pageTitle: 'Sign In',
    path: '/user/signin',
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

exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => console.log(err));
  res.redirect('/');
};
