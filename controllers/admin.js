const Product = require('../models/product');
const { validationResult } = require('express-validator/check');

const fileHelper = require('../util/file');

exports.getAdmin = (req, res, next) => {
  res.render('admin/index', {
    pageTitle: 'Admin',
    path: '/admin',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getEditProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render('admin/edit-products', {
        pageTitle: 'Edit Products',
        path: '/admin/edit-products',
        products: products,
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    editing: false,
    hasError: false,
    errorMessage: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;
  const errors = validationResult(req);
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
        image: image,
      },
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
    });
  }
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
        image: image,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  const imageUrl = image.path;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    image: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log('Created product');
      res.redirect('/');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      hasError: false,
      errorMessage: null,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        image: updatedImage,
        description: updatedDescription,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        fileHelper.deleteFile(product.image);
        product.image = image.path;
      }
      return product.save().then((result) => {
        console.log('Updated Product!');
        res.redirect('/admin/edit-products');
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error('Product Not Found'));
      }
      fileHelper.deleteFile(product.image);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log('Destroyed product');
      res.redirect('/admin/edit-products');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
