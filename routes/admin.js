const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');

// /admin => GET
router.get('/', isAdmin, adminController.getAdmin);

// /admin/add-product => GET
router.get('/add-product', isAdmin, adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', isAdmin, adminController.postAddProduct);

// /admin/edit-products => GET
router.get('/edit-products', isAdmin, adminController.getEditProducts);

// /admin/edit-product => GET
router.get('/edit-product/:productId', isAdmin, adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product', isAdmin, adminController.postEditProduct);

// /admin/delete-product => POST
router.post('/delete-product', isAdmin, adminController.postDeleteProduct);

module.exports = router;
