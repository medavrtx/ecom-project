const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');

// /admin => GET
router.get('/', isAdmin, adminController.getAdmin);

// /admin/add-product => GET
router.get('/add-product', isAdmin, adminController.getAddProduct);

// /admin/add-product => POST
router.post(
  '/add-product',
  [
    body('title').isString().isLength({ min: 1 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 1, max: 400 }).trim()
  ],
  isAdmin,
  adminController.postAddProduct
);

// /admin/edit-products => GET
router.get('/edit-products', isAdmin, adminController.getEditProducts);

// /admin/edit-product => GET
router.get(
  '/edit-products/:productId',
  isAdmin,
  adminController.getEditProduct
);

// /admin/edit-product => POST
router.post(
  '/edit-products',
  [
    body('title').isString().isLength({ min: 1 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 1, max: 400 }).trim()
  ],
  isAdmin,
  adminController.postEditProduct
);

// /admin/delete-product => DELETE
router.delete(
  '/edit-products/:productId',
  isAdmin,
  adminController.deleteProduct
);

// /admin/edit-categories => GET
router.get('/edit-categories', isAdmin, adminController.getEditCategories);

// /admin/add-category => POST
router.post('/add-category', isAdmin, adminController.postAddCategory);

// /admin/edit-categories => DELETE
router.delete(
  '/edit-categories/:categoryId',
  isAdmin,
  adminController.deleteCategory
);

// /admin/edit-categories => GET
router.get(
  '/edit-categories/:categoryId',
  isAdmin,
  adminController.getEditCategory
);

// /admin/edit-categories => POST
router.post(
  '/edit-categories/:categoryId',
  isAdmin,
  adminController.postEditCategory
);

// /admin/edit-categories/categoryId/add-product => POST
router.post(
  '/edit-categories/:categoryId/add-product',
  isAdmin,
  adminController.postProductToCategory
);

// /admin/edit-categories/categoryId/add-product => DELETE
router.delete(
  '/edit-categories/:categoryId/:productId',
  isAdmin,
  adminController.deleteProductFromCategory
);

router.get('/best-sellers', isAdmin, adminController.getBestSellers);

module.exports = router;
