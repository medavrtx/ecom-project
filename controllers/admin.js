const { validationResult } = require('express-validator');

const Product = require('../models/product');
const Order = require('../models/order');
const ProductCategory = require('../models/product-category');

const fileHelper = require('../util/file');

const ITEMS_PER_PAGE = 9;

// GET ADMIN
exports.getAdmin = async (req, res, next) => {
  try {
    const [numProducts, numOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments()
    ]);

    res.render('admin/index', {
      pageTitle: 'Admin Dashboard',
      path: '/admin',
      user: req.user,
      numListed: numProducts,
      numOrders: numOrders,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// GET PRODUCTS
exports.getProducts = async (req, res, next) => {
  const page = +req.query.page || 1;
  const ITEMS_PER_PAGE = 3;

  try {
    const totalItems = await Product.find({
      userId: req.user._id
    }).countDocuments();
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (ITEMS_PER_PAGE * page - 1 > totalItems) {
      return res.redirect('/admin/products');
    }

    res.render('admin/products', {
      pageTitle: 'Products',
      path: '/admin/products',
      products: products,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      csrfToken: req.csrfToken(),
      totalProducts: totalItems,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// ADD PRODUCT - GET
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/products/add',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    editing: false,
    hasError: false,
    hasImage: false,
    errorMessage: null
  });
};

// ADD PRODUCT - POST
exports.postAddProduct = async (req, res, next) => {
  const { title, price, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  const renderError = (errorMessage, hasImage, validationErrors = []) => {
    if (image) {
      fileHelper.deleteFile(image.path);
    }

    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/products/add',
      editing: false,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      hasError: true,
      hasImage,
      product: {
        title,
        price,
        description,
        image
      },
      errorMessage,
      validationErrors
    });
  };

  try {
    if (!image || !image.mimetype.startsWith('image/')) {
      return renderError('Please enter a valid image', false);
    }

    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((error) => error.msg);
      const hasImage = !!image.path;
      return renderError(
        'Validation failed. Please check your inputs.',
        hasImage,
        validationErrors
      );
    }

    const imageUrl = image.path;
    const product = new Product({
      title,
      price,
      description,
      image: imageUrl,
      userId: req.user
    });

    await product.save();
    console.log('Created product');
    res.redirect('/admin/products');
  } catch (err) {
    return next(err);
  }
};

// EDIT PRODUCT - GET
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/products/' + prodId,
        editing: editMode,
        product,
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        hasError: false,
        hasImage: true,
        errorMessage: null
      });
    })
    .catch((err) => {
      next(err);
    });
};

// EDIT PRODUCT - POST
exports.postEditProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const image = req.file;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/products/' + prodId,
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        editing: true,
        hasError: true,
        product: {
          title: updatedTitle,
          price: updatedPrice,
          image: image ? image.path : '',
          description: updatedDescription,
          _id: prodId
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }

    const product = await Product.findById(prodId);
    if (!product || product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDescription;

    if (image) {
      fileHelper.deleteFile(product.image);
      product.image = image.path;
    }
    await product.save();
    console.log('Updated Product!');
    res.redirect('/admin/products');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await Product.findById(prodId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    fileHelper.deleteFile(product.image);
    await Product.deleteOne({ _id: prodId, userId: req.user._id });

    console.log('Destroyed product');
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed!', error: err.message });
  }
};

// CATEGORIES

// GET CATEGORIES
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await ProductCategory.find().populate(
      'products.productId'
    );
    res.render('admin/categories', {
      pageTitle: 'Categories',
      path: '/admin/categories',
      categories,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    next(err);
  }
};

// ADD CATEGORY
exports.postAddCategory = async (req, res, next) => {
  const title = req.body.title;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const categories = await ProductCategory.find();
      return res.render('admin/categories', {
        pageTitle: 'Categories',
        path: '/admin/categories',
        categories: categories,
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        csrfToken: req.csrfToken(),
        errorMessage: errors.array()[0].msg
      });
    }

    const productCategory = new ProductCategory({
      title
    });

    await productCategory.save();
    console.log('Created category');
    res.redirect('/admin/categories');
  } catch (err) {
    // Pass the error to the global error handler
    next(err);
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res, next) => {
  try {
    const catId = req.params.categoryId;
    const category = await ProductCategory.findById(catId);

    if (!category) {
      const error = new Error('Category Not Found');
      error.statusCode = 404;
      throw error;
    }

    await ProductCategory.deleteOne({ _id: catId });
    console.log('Deleted category');
    res.status(200).json({ message: 'Delete successful!' });
  } catch (err) {
    next(err);
  }
};

exports.getEditCategory = async (req, res, next) => {
  try {
    const catId = req.params.categoryId;
    const category = await ProductCategory.findById(catId).populate(
      'products.productId'
    );

    if (!category) {
      const error = new Error('Category Not Found');
      error.statusCode = 404;
      throw error;
    }

    const products = await Product.find();

    return res.render('admin/edit-category', {
      pageTitle: 'Edit Category',
      path: '/admin/categories/' + catId,
      category: category,
      products: products,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      csrfToken: req.csrfToken(),
      successMessage: null
    });
  } catch (err) {
    next(err);
  }
};

exports.postEditCategory = async (req, res, next) => {
  try {
    const catId = req.body.categoryId;
    const updatedTitle = req.body.title;

    const category = await ProductCategory.findById(catId).populate(
      'products.productId'
    );
    if (!category) {
      const error = new Error('Category Not Found');
      error.statusCode = 404;
      throw error;
    }

    category.title = updatedTitle;
    await category.save();

    const products = await Product.find();

    console.log('Updated Category!');
    res.render('admin/edit-category', {
      pageTitle: 'Edit Category',
      path: '/admin/categories/' + catId,
      category: category,
      products: products,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      csrfToken: req.csrfToken(),
      successMessage: 'Successfully updated'
    });
  } catch (err) {
    next(err);
  }
};

exports.postProductToCategory = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const catId = req.body.categoryId;

    const product = await Product.findById(prodId);
    if (!product) {
      const error = new Error('Product Not Found');
      error.statusCode = 404;
      throw error;
    }

    const category = await ProductCategory.findById(catId);
    if (!category) {
      const error = new Error('Category Not Found');
      error.statusCode = 404;
      throw error;
    }

    await category.addToCategory(product);
    res.redirect('/admin/categories/' + catId);
  } catch (err) {
    next(err);
  }
};

exports.deleteProductFromCategory = async (req, res, next) => {
  try {
    const catId = req.params.categoryId;
    const prodId = req.params.productId;

    const category = await ProductCategory.findById(catId);
    if (!category) {
      const error = new Error('Category Not Found');
      error.statusCode = 404;
      throw error;
    }

    await category.removeFromCategory(prodId);

    console.log('Deleted product from category');
    res.status(200).json({ message: 'Success!' });
  } catch (err) {
    next(err);
  }
};

exports.getBestSellers = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('admin/best-sellers', {
        pageTitle: 'Best Sellers',
        path: '/admin/best-sellers',
        products: products,
        bestSellers: [
          { title: 'ayo', price: 22, _id: '0101' },
          { title: 'ayo2', price: 22, _id: '0101' }
        ],
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        csrfToken: req.csrfToken()
      });
    })
    .catch((err) => {
      next(err);
    });
};
