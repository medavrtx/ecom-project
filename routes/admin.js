const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

// /admin => GET
router.get('/', adminController.getAdmin);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => GET
router.get('/edit-products', adminController.getEditProducts);

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

module.exports = router;
