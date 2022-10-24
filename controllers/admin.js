const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getAdmin = (req, res, next) => {
  res.render('admin/index', {
    pageTitle: 'Admin',
    path: '/admin',
  });
};

exports.getEditProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render('admin/edit-products', {
        pageTitle: 'Edit Products',
        path: '/admin/edit-products',
        products: products.reverse(),
      });
    })
    .catch((err) => console.log(err));
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
  req.user
    .createProduct({
      title: title,
      price: price,
      image: image,
      description: description,
    })
    .then((result) => {
      res.redirect('/admin/edit-products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({ where: { id: prodId } }).then((products) => {
    const product = products[0];
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
  // Product.findByPk(prodId)
  // .then((product) => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedImage = req.body.image;
  // const updatedColorOptions = req.body.colorOptions;
  // const updatedSizeOptions = req.body.sizeOptions;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImage
    // updatedColorOptions,
    // updatedSizeOptions
  );
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.image = updatedImage;
      return product.save();
    })
    .then((result) => {
      console.log('Updated Product!');
      res.redirect('/admin/edit-products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log('Destroyed product');
      res.redirect('/admin/edit-products');
    })
    .catch((err) => console.log(err));
};
