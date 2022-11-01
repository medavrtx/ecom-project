const express = require('express');
const router = express.Router();

const User = require('../models/user');

const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

// /sign-in => GET
router.get('/login', authController.getLogIn);

// /register=> GET
router.get(
  '/registration',
  check('email').isEmail(),
  authController.getRegistration
);

// /reset=> GET
router.get('/reset', authController.getReset);

// /sign-in => POST
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password', 'Please enter a password with at least 5 characters')
      .isLength({ min: 5 })
      .trim(),
  ],
  authController.postLogIn
);

// /register=> POST
router.post(
  '/registration',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body('password', 'Please enter a password with at least 5 characters.')
      .isLength({ min: 5 })
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match');
        }
        return true;
      }),
  ],
  authController.postRegistration
);

// /reset=> GET
router.post('/reset', authController.postReset);

// /logout => POST
router.post('/logoutuser', authController.postLogOut);

// /user => GET
router.get('/user/:userId', isAuth, authController.getUser);

// /user/orders => GET
router.get('/user/:userId/orders', isAuth, authController.getOrders);

// /user/orders/invoice => GET
router.get('/user/:userId/orders/:orderId', isAuth, authController.getInvoice);

module.exports = router;
