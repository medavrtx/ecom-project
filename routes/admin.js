const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

// /admin => GET
router.get('/admin', adminController.getAdmin);

// /admin/products => GET
router.get('/admin/products', adminController.getProducts);

// /admin/add-product => GET
router.get('/admin/edit-products', adminController.getEditProducts);

// /admin/add-product => GET
router.get('/admin/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post('/admin/add-product', adminController.postAddProduct);

module.exports = router;
