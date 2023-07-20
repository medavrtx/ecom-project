const { validationResult } = require('express-validator');

const Product = require('../models/product');
const Order = require('../models/order');
const ProductCategory = require('../models/product-category');

const fileHelper = require('../util/file');

const categoryOptions = [
  {
    value: 'uncategorized',
    name: 'Select a category',
    _id: '0101',
    products: [
      { title: 'booger', price: 22, _id: '0101' },
      { title: 'yum', price: 22, _id: '0101' }
    ]
  },
  {
    value: 'kits',
    name: 'Kits',
    _id: '0101',
    products: [{ title: 'booger', price: 22, _id: '0101' }]
  },
  {
    value: 'skincare',
    name: 'Skincare',
    _id: '0101',
    products: [{ title: 'booger', price: 22, _id: '0101' }]
  },
  {
    value: 'sun-protection',
    name: 'Sun Protection',
    _id: '0101',
    products: [{ title: 'booger', price: 22, _id: '0101' }]
  }
];

const ITEMS_PER_PAGE = 9;

exports.getAdmin = (req, res, next) => {
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      Order.find()
        .countDocuments()
        .then((numOrders) => {
          res.render('admin/index', {
            pageTitle: 'Admin Dashboard',
            path: '/admin',
            user: req.user,
            numListed: numProducts,
            numOrders: numOrders,
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  const ITEMS_PER_PAGE = 3;
  let totalItems;
  Product.find({ userId: req.user._id })
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      if (ITEMS_PER_PAGE * page - 1 > totalItems) {
        res.redirect('/admin/edit-products');
      }
      res.render('admin/edit-products', {
        pageTitle: 'Edit Products',
        path: '/admin/edit-products',
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
    categoryOptions,
    editing: false,
    hasError: false,
    errorMessage: null
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const category = req.body.category;
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
        category: category,
        image: image
      },
      errorMessage: 'Attached file is not an image',
      validationErrors: []
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
        category: category,
        image: image
      },
      errorMessage: errors.array()[0].msg
    });
  }
  const imageUrl = image.path;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    category: category,
    image: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then((result) => {
      console.log('Created product');
      res.redirect('/admin/edit-products');
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
      path: '/admin/edit-products/:productId',
      editing: editMode,
      product: product,
      categoryOptions,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      hasError: false,
      errorMessage: null
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedCategory = req.body.category;
  const image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-products/:productId',
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
        updatedCategory: updatedCategory,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
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
      product.category = updatedCategory;
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

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
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
      res.status(200).json({ message: 'Success!' });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Delete failed!' });
    });
};

// CATEGORIES
exports.getEditCategories = (req, res, next) => {
  ProductCategory.find().then((categories) => {
    res.render('admin/edit-categories', {
      pageTitle: 'Edit Categories',
      path: '/admin/categories',
      categories: categories,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      csrfToken: req.csrfToken()
    });
  });
};

exports.postAddCategory = (req, res, next) => {
  const title = req.body.title;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return ProductCategory.find().then((categories) => {
      res.render('admin/edit-categories', {
        pageTitle: 'Edit Categories',
        path: '/admin/categories',
        categories: categories,
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        csrfToken: req.csrfToken(),
        errorMessage: errors.array()[0].msg
      });
    });
  }

  const productCategory = new ProductCategory({
    title
  });
  productCategory
    .save()
    .then((result) => {
      console.log('Created category');
      return res.redirect('/admin/edit-categories');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteCategory = (req, res, next) => {
  const catId = req.params.categoryId;
  ProductCategory.findById(catId)
    .then((category) => {
      if (!category) {
        return next(new Error('Category Not Found'));
      }

      return ProductCategory.deleteOne({ _id: catId });
    })
    .then(() => {
      console.log('Deleted category');
      res.status(200).json({ message: 'Success!' });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Delete failed!' });
    });
};

exports.getEditCategory = (req, res, next) => {
  const catId = req.params.categoryId;

  ProductCategory.findById(catId)
    .then((category) => {
      if (!category) {
        return next(new Error('Category Not Found'));
      }
      category.populate('products.productId').then((category) => {
        Product.find()
          .then((products) => {
            return res.render('admin/edit-category', {
              pageTitle: 'Edit Category',
              path: '/admin/edit-categories/',
              category: category,
              products: products,
              user: req.user,
              isAuthenticated: req.session.isLoggedIn,
              isAdmin: req.session.isAdmin,
              csrfToken: req.csrfToken(),
              successMessage: null
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed!' });
    });
};

exports.postEditCategory = (req, res, next) => {
  const catId = req.body.categoryId;
  const updatedTitle = req.body.title;

  ProductCategory.findById(catId)
    .then((category) => {
      if (!category) {
        return next(new Error('Product Not Found'));
      }

      category.title = updatedTitle;

      return Product.find().then((products) => {
        category.save().then((result) => {
          console.log('Updated Category!');
          res.render('admin/edit-category', {
            pageTitle: 'Edit Category',
            path: '/admin/edit-categories/',
            category: category,
            products: products,
            user: req.user,
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.isAdmin,
            csrfToken: req.csrfToken(),
            successMessage: 'Successfully updated'
          });
        });
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postProductToCategory = (req, res, next) => {
  const prodId = req.body.productId;
  const catId = req.body.categoryId;
  Product.findById(prodId)
    .then((product) => {
      ProductCategory.findById(catId).then((category) => {
        category.addToCategory(product);
      });
    })
    .then((result) => {
      res.redirect('/admin/edit-categories/' + catId);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProductFromCategory = (req, res, next) => {
  const catId = req.params.categoryId;
  const prodId = req.params.productId;

  ProductCategory.findById(catId)
    .then((category) => {
      if (!category) {
        return next(new Error('Category Not Found'));
      }
      category.removeFromCategory(prodId);
    })
    .then(() => {
      console.log('Deleted category');
      res.status(200).json({ message: 'Success!' });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Delete failed!' });
    });
};

exports.getBestSellers = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find({ userId: req.user._id })
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
