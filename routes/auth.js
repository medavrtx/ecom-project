const express = require('express');
const router = express.Router();

const User = require('../models/user');

const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const {
  validateLogin,
  validateRegister,
  validateSettings,
  validateReset
} = require('../middleware/validate');

// /login
router
  .route('/login')
  .get(authController.getLogIn)
  .post(validateLogin, authController.postLogIn);

// /register
router
  .route('/registration')
  .get(check('email').isEmail(), authController.getRegistration)
  .post(
    validateRegister,
    [
      check('email').custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject(
            'Email exists already, please pick a different one.'
          );
        }
      })
    ],
    authController.postRegistration
  );

// /reset
router
  .route('/reset')
  .get(authController.getReset)
  .post(
    validateReset,
    [
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
  .post(isAuth, validateSettings, authController.postSettings);

module.exports = router;
