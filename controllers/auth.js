const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');

const User = require('../models/user');
const Order = require('../models/order');

exports.getLogIn = (req, res, next) => {
  const errorMessage = req.flash('error')[0] || null;
  res.render('auth/login', {
    pageTitle: 'Sign In',
    path: '/user/login',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    errorMessage,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.postLogIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email,
          password
        },
        validationErrors: errors.array()
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password',
        oldInput: {
          email,
          password
        },
        validationErrors: []
      });
    }

    const doMatch = await bcrypt.compare(password, user.toObject().password);
    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.isAdmin = user.isAdmin;
      req.session.user = user;
      await req.session.save();
      return res.redirect('/');
    }

    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: 'Invalid email or password',
      oldInput: {
        email,
        password
      },
      validationErrors: []
    });
  } catch (err) {
    next(err);
  }
};

exports.getRegistration = (req, res, next) => {
  const errorMessage = req.flash('error')[0] || null;
  res.render('auth/registration', {
    pageTitle: 'Register',
    path: '/registration',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    errorMessage,
    oldInput: {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  });
};

exports.postRegistration = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, confirmPassword, agreement } =
      req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/registration', {
        path: '/registration',
        pageTitle: 'Register',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email,
          password,
          firstName,
          lastName
        }
      });
    }

    if (!agreement) {
      return res.status(422).render('auth/registration', {
        path: '/registration',
        pageTitle: 'Register',
        errorMessage:
          'Please agree to the terms by checking the agreement checkbox before submitting the form',
        oldInput: {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
        }
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).render('auth/registration', {
        path: '/registration',
        pageTitle: 'Register',
        errorMessage: 'Passwords do not match',
        oldInput: {
          email,
          password,
          firstName,
          lastName,
          confirmPassword: ''
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isAdmin: false,
      cart: { items: [] }
    });

    await user.save();
    console.log('success');
    res.redirect('/login');
  } catch (err) {
    next(err);
  }
};

exports.getReset = (req, res, next) => {
  const errorMessage = req.flash('error')[0] || null;
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    errorMessage
  });
};

exports.postReset = async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    if (newPassword !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/login');
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      !(await bcrypt.compare(currentPassword, user.password)) ||
      newPassword !== confirmPassword
    ) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    if (req.user instanceof User) {
      req.flash('success', 'Successfully reset password!');
      return res.redirect('/user/' + req.user._id);
    } else {
      req.flash('success', 'Successfully reset password!');
      return res.redirect('/login');
    }
  } catch (err) {
    next(err);
  }
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => console.log(err));
  res.redirect('/');
};

exports.getUser = (req, res, next) => {
  res.render('auth/index', {
    pageTitle: 'My Account',
    path: '/user',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id }).sort({
      createdAt: -1
    });
    res.render('auth/orders', {
      path: '/user/orders',
      pageTitle: 'My Orders',
      orders,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin
    });
  } catch (err) {
    next(err);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('No order found.');
    }

    if (order.user.userId.toString() !== req.user._id.toString()) {
      throw new Error('Unauthorized');
    }

    const user = await User.findById(order.user.userId);

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('data', 'invoices', invoiceName);

    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('INVOICE', { align: 'right' })
      .moveDown(0.5);

    pdfDoc
      .font('Helvetica')
      .fontSize(14)
      .text(`Invoice Number: ${orderId}`, { align: 'right' })
      .moveDown(0.5)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, {
        align: 'right'
      })
      .moveDown(0.5);

    pdfDoc
      .fontSize(14)
      .text('Bill To:')
      .font('Helvetica-Bold')
      .text(`${user.firstName} ${user.lastName}`)
      .font('Helvetica')
      .text(user.email)
      .moveDown(1.5);

    // Order Details
    pdfDoc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Order Details')
      .moveDown(0.5);

    order.products.forEach((prod) => {
      const itemTotal = prod.quantity * prod.product.price;

      pdfDoc
        .font('Helvetica')
        .fontSize(12)
        .text(
          `${prod.product.title} x ${prod.quantity} - $${prod.product.price} each`
        )
        .text(`Total: $${itemTotal.toFixed(2)}`)
        .moveDown(0.5);
    });

    // Total Price
    pdfDoc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Total Details', {
        align: 'right'
      })
      .font('Helvetica')
      .text(`Subtotal: $${order.totalDetails.subtotal.toFixed(2)}`, {
        align: 'right'
      })
      .text(`Tax: $${order.totalDetails.tax.toFixed(2)}`, {
        align: 'right'
      })
      .text(`Shipping: $${order.totalDetails.shipping.toFixed(2)}`, {
        align: 'right'
      })
      .moveDown(1)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(`Total: $${order.totalDetails.total.toFixed(2)}`, {
        align: 'right'
      })
      .moveDown(1);

    // Thank You Message
    pdfDoc
      .font('Helvetica')
      .fontSize(14)
      .text('Thank you for your purchase!', { align: 'center' })
      .moveDown(1);

    pdfDoc.end();
  } catch (err) {
    next(err);
  }
};
