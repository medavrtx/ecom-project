const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getAdmin = (req, res, next) => {
  res.render('admin/index', {
    pageTitle: 'Admin',
    path: '/admin',
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      pageTitle: 'Products',
      path: '/admin/products',
      products: products.reverse(),
    });
  });
};

exports.getEditProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/edit-products', {
      pageTitle: 'Edit Products',
      path: '/admin/edit-products',
      products: products.reverse(),
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.body.image;
  // const colorOptions = req.body.colorOptions;
  // const sizeOptions = req.body.sizeOptions;
  const product = new Product(
    null,
    title,
    price,
    description,
    image
    // colorOptions,
    // sizeOptions
  );
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedImage = req.body.image;
  const updatedColorOptions = req.body.colorOptions;
  const updatedSizeOptions = req.body.sizeOptions;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImage,
    updatedColorOptions,
    updatedSizeOptions
  );
  updatedProduct.save();
  res.redirect('/admin/edit-products');
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.deleteById(prodId);
  res.redirect('/admin/edit-products');
};
