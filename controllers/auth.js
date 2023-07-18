const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');

const User = require('../models/user');
const Order = require('../models/order');

exports.getLogIn = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    pageTitle: 'Sign In',
    path: '/user/login',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

exports.postLogIn = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.toObject().password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.isAdmin = user.isAdmin;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getRegistration = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/registration', {
    pageTitle: 'Create Account',
    path: '/registration',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });
};

exports.postRegistration = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const agreement = req.body.agreement;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/registration', {
      path: '/registration',
      pageTitle: 'Registration',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      },
    });
  }
  if (!agreement) {
    return res.status(422).render('auth/registration', {
      path: '/registration',
      pageTitle: 'Registration',
      errorMessage:
        'Please agree to the terms by checking the agreement checkbox before submitting the form',
      oldInput: {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      },
    });
  }
  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        isAdmin: false,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      console.log('success');
      res.redirect('/login');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  const currentPw = req.body.currentPassword;
  const newPw = req.body.newPassword;
  const confirmPw = req.body.confirmPassword;
  let resetUser;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }
    bcrypt.compare(currentPw, user.password).then((doMatch) => {
      if (doMatch && newPw === confirmPw) {
        resetUser = user;
      } else {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
      }
    });
    bcrypt
      .hash(newPw, 12)
      .then((hashedPassword) => {
        resetUser.password = hashedPassword;
        return resetUser.save();
      })
      .then((result) => {
        req.flash('success', 'Successfully reset password!');
        return res.redirect('/login');
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => console.log(err));
  res.redirect('/');
};
exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => console.log(err));
  res.redirect('/');
};

exports.getUser = (req, res, next) => {
  res.render('auth/index', {
    pageTitle: 'Your Cart',
    path: '/user',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .sort({ createdAt: -1 })
    .then((orders) => {
      res.render('auth/orders', {
        path: '/user/orders',
        pageTitle: 'My Orders',
        orders: orders,
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('ECOM');
      pdfDoc.moveUp();
      pdfDoc.text('_______________________________');
      pdfDoc.fontSize(20).text('Invoice', { underline: true });
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice = totalPrice + prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              '$' +
              prod.product.price
          );
      });
      pdfDoc.moveDown();
      pdfDoc.text('_________________');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();
    })
    .catch((err) => next(err));
};
