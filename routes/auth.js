const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// /sign-in => GET
router.get('/signin', authController.getSignIn);

// /sign-in => POST
router.post('/signinuser', authController.postSignIn);

// /logout => POST
router.post('/logoutuser', authController.postLogOut);

module.exports = router;
