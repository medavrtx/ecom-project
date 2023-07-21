const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');

// Middleware to protect admin routes
router.use(isAdmin);

// /admin => GET
router.get('/', adminController.getAdmin);

// /admin/products

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => GET
router.get('/products/add', adminController.getAddProduct);

// /admin/products/add => POST
router.post(
  '/products/add',
  [
    body('title').isString().isLength({ min: 1 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 1, max: 400 }).trim()
  ],

  adminController.postAddProduct
);

// /admin/products/:productId => GET
router.get(
  '/products/:productId',

  adminController.getEditProduct
);

// /admin/products/:productId => POST
router.post(
  '/products/edit',
  [
    body('title').isString().isLength({ min: 1 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 1, max: 400 }).trim()
  ],

  adminController.postEditProduct
);

// /admin/products/:productId/delete => DELETE
router.delete(
  '/products/:productId/delete',

  adminController.deleteProduct
);

// /admin/categories

// /admin/categories => GET
router.get('/categories', adminController.getCategories);

// /admin/categories/add => POST
router.post('/categories/add', adminController.postAddCategory);

// /admin/categories/:categoryId/delete => DELETE
router.delete('/categories/:categoryId/delete', adminController.deleteCategory);

// /admin/categories/:categoryId => GET
router.get('/categories/:categoryId', adminController.getEditCategory);

// /admin/categories/:categoryId => POST
router.post('/categories/:categoryId', adminController.postEditCategory);

// /admin/categories/:categoryId/add-product => POST
router.post(
  '/categories/:categoryId/add-product',
  adminController.postProductToCategory
);

// /admin/categories/:categoryId/:productId/delete => DELETE
router.delete(
  '/categories/:categoryId/:productId/delete',
  adminController.deleteProductFromCategory
);

// /admin/best-sellers => GET
router.get('/best-sellers', adminController.getBestSellers);

module.exports = router;
