const express = require('express');
const router = express.Router();

const User = require('../models/user');

const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

// /login
router
  .route('/login')
  .get(authController.getLogIn)
  .post(
    [
      check('email').isEmail().withMessage('Please enter a valid email'),
      body('password', 'Please enter a password with at least 5 characters')
        .isLength({ min: 5 })
        .trim()
    ],
    authController.postLogIn
  );

// /register
router
  .route('/registration')
  .get(check('email').isEmail(), authController.getRegistration)
  .post(
    [
      check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom(async (value, { req }) => {
          const userDoc = await User.findOne({ email: value });
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        }),
      body('firstName', 'Please enter a first name.')
        .isLength({ min: 1 })
        .trim(),
      body('lastName', 'Please enter a last name.').isLength({ min: 1 }).trim(),
      body('password', 'Please enter a password with at least 5 characters.')
        .isLength({ min: 5 })
        .trim(),
      check('agreement')
        .not()
        .isEmpty()
        .withMessage(
          'Please agree to the terms by checking the agreement checkbox before submitting the form.'
        )
        .toBoolean()
        .isBoolean()
        .withMessage('Invalid value for agreement. Please check the checkbox.'),
      body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords have to match');
          }
          return true;
        })
    ],
    authController.postRegistration
  );

// /reset
router
  .route('/reset')
  .get(authController.getReset)
  .post(
    [
      check('email').isEmail().withMessage('Please enter a valid email.'),
      body('newPassword', 'Please enter a password with at least 5 characters.')
        .trim()
        .isLength({ min: 5 }),
      body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
          if (value !== req.body.newPassword) {
            throw new Error('Passwords have to match');
          }
          return true;
        })
    ],
    authController.postReset
  );

// /logout
router.post('/logout', authController.postLogOut);

// /user => GET
router.get('/user/:userId', isAuth, authController.getUser);

// /user/orders => GET
router.get('/user/:userId/orders', isAuth, authController.getOrders);

// /user/orders/invoice => GET
router.get('/user/:userId/orders/:orderId', isAuth, authController.getInvoice);

// /user/settings
router
  .route('/user/:userId/settings')
  .get(isAuth, authController.getSettings)
  .post(
    [
      check('email').isEmail().withMessage('Please enter a valid email.'),
      body('firstName', 'Please enter a valid name.')
        .isLength({ min: 1 })
        .trim(),
      body('lastName', 'Please enter a valid name.').isLength({ min: 1 }).trim()
    ],
    isAuth,
    authController.postSettings
  );

module.exports = router;
