const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');
const ProductCategory = require('../models/product-category');
const BestSeller = require('../models/best-seller');
const User = require('../models/user');

const fileHelper = require('../utils/File');

// GET ADMIN
exports.getAdmin = async (req, res, next) => {
  try {
    const [numProducts, numOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments()
    ]);

    const profitResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$totalDetails.total' }
        }
      }
    ]);

    const profit = parseFloat(
      profitResult.length ? profitResult[0].totalProfit : 0
    ).toFixed(2);

    res.render('admin/index', {
      pageTitle: 'Admin Dashboard',
      path: '/admin',
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      numListed: numProducts,
      numOrders: numOrders,
      profit
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
  const ITEMS_PER_PAGE = 10;

  try {
    const totalItems = await Product.find({
      userId: req.user._id
    }).countDocuments();
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (ITEMS_PER_PAGE * (page - 1) > totalItems) {
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
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  } catch (err) {
    next(err);
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
      return renderError('Please select a image', false);
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
    req.flash('success', 'Successfully added product!');
    console.log('Created product');
    res.redirect('/admin/products');
  } catch (err) {
    return next(err);
  }
};

// EDIT PRODUCT - GET
exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/admin/products');
    }

    const prodId = req.params.productId;
    const product = await Product.findById(prodId);

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
  } catch (err) {
    next(err);
  }
};

// EDIT PRODUCT - POST
exports.postEditProduct = async (req, res, next) => {
  try {
    const {
      productId: prodId,
      title: updatedTitle,
      price: updatedPrice,
      description: updatedDescription
    } = req.body;

    const image = req.file;
    const errors = validationResult(req);
    const product = await Product.findById(prodId);

    const renderError = (errorMessage, validationErrors = []) => {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: `/admin/products/${prodId}?edit=true`,
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        editing: true,
        hasError: true,
        hasImage: true,
        product: {
          title: updatedTitle,
          price: updatedPrice,
          image: product.image,
          description: updatedDescription,
          _id: prodId
        },
        errorMessage: errorMessage,
        validationErrors: validationErrors
      });
    };

    if (!image && req.body.deleteImage === 'true') {
      return renderError(
        'To replace the current image, please select a new image. Please do not leave the image empty.'
      );
    }

    if (!errors.isEmpty()) {
      return renderError(errors.array()[0].msg);
    }

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
    req.flash('success', 'Successfully updated product!');
    console.log('Updated Product!');
    res.redirect('/admin/products');
  } catch (err) {
    next(err);
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

    await ProductCategory.updateMany(
      { 'products.productId': product._id },
      { $pull: { products: { productId: product._id } } }
    );

    const bestSellerItem = await BestSeller.findOne({ productId: prodId });

    if (bestSellerItem) {
      const deletedOrder = bestSellerItem.order;

      await BestSeller.updateMany(
        { order: { $gt: deletedOrder } },
        { $inc: { order: -1 } }
      );

      await BestSeller.deleteOne({ productId: prodId });
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
      user: req.user,
      categories,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin
    });
  } catch (err) {
    next(err);
  }
};

// ADD CATEGORY
exports.postAddCategory = async (req, res, next) => {
  const title = req.body.title;

  try {
    const productCategory = new ProductCategory({
      title
    });

    await productCategory.save();
    req.flash('success', 'Successfully added category!');
    console.log('Created category');
    res.redirect('/admin/categories');
  } catch (err) {
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

// EDIT CATEGORY - GET
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
      isAdmin: req.session.isAdmin
    });
  } catch (err) {
    next(err);
  }
};

// EDIT CATEGORY - POST
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
    console.log('Updated Category!');
    req.flash('success', 'Successfully updated category!');
    res.redirect(`/admin/categories/${catId}`);
  } catch (err) {
    next(err);
  }
};

// POST PRODUCT TO CATEGORY
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

    const data = await category.addToCategory(product);
    if (data) {
      req.flash('success', 'Successfully added product to category!');
      res.redirect('/admin/categories/' + catId);
    } else {
      req.flash('error', 'Product already exists in category!');
      res.redirect('/admin/categories/' + catId);
    }
  } catch (err) {
    next(err);
  }
};

// DELETE PRODUCT FROM CATEGORY
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

// BEST SELLERS - GET
exports.getBestSellers = async (req, res, next) => {
  try {
    const bestSellers = await BestSeller.find()
      .populate('productId')
      .sort({ order: 1 });

    const products = await Product.find();

    const bestSellerProductIds = bestSellers.map((bestSeller) =>
      bestSeller.productId._id.toString()
    );

    const nonBestSellers = products.filter(
      (product) => !bestSellerProductIds.includes(product._id.toString())
    );

    res.render('admin/best-sellers', {
      pageTitle: 'Best Sellers',
      path: '/admin/best-sellers',
      products: nonBestSellers,
      bestSellers,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// BEST SELLERS - POST

exports.postBestSeller = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const existingProduct = await BestSeller.findOne({ productId: prodId });

    if (existingProduct) {
      req.flash('error', 'Product already exists in the best sellers list.');
      return res.redirect('/admin/best-sellers');
    }

    const totalItems = await BestSeller.countDocuments();

    const bestSeller = new BestSeller({
      productId: prodId,
      order: totalItems + 1
    });

    await bestSeller.save();
    req.flash('success', 'Successfully added product to Best Sellers!');
    console.log('Added to Best Seller!');
    res.redirect('/admin/best-sellers');
  } catch (err) {
    next(err);
  }
};

// BEST SELLERS - DELETE

exports.deleteBestSeller = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    await BestSeller.deleteOne({ productId: productId });

    // Update the orders of the remaining items
    const bestSellers = await BestSeller.find().sort({ order: 1 });
    for (let i = 0; i < bestSellers.length; i++) {
      bestSellers[i].order = i + 1;
      await bestSellers[i].save();
    }

    res.status(200).json({ message: 'Product removed from best sellers list' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove product' });
  }
};

// BEST SELLERS - PUT

exports.updateBestSeller = async (req, res, next) => {
  const productId = req.params.productId;
  const newOrder = req.body.order;

  try {
    const bestSeller = await BestSeller.findOne({ productId });

    if (!bestSeller) {
      return res.status(404).json({ message: 'Best seller not found' });
    }

    bestSeller.order = newOrder;
    await bestSeller.save();

    res.status(200).json({ message: 'Best seller order updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update best seller order' });
  }
};

// ORDERS

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1
    });

    res.render('admin/orders', {
      path: '/admin/orders',
      pageTitle: 'Orders',
      orders,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin
    });
  } catch (err) {
    next(err);
  }
};

// INVOICE

exports.getInvoice = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('No order found.');
    }

    let user = await User.findById(order.user.userId);

    if (!user) {
      user = {
        email: 'Guest Email',
        firstName: 'Guest User',
        lastName: ''
      };
    }

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('data', 'invoices', invoiceName);

    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('INVOICE', { align: 'right' })
      .moveDown(0.5);

    pdfDoc
      .font('Helvetica')
      .fontSize(14)
      .text(`Invoice Number: ${orderId}`, { align: 'right' })
      .moveDown(0.5)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, {
        align: 'right'
      })
      .moveDown(0.5);

    pdfDoc
      .fontSize(14)
      .text('Bill To:')
      .font('Helvetica-Bold')
      .text(`${user.firstName} ${user.lastName}`)
      .font('Helvetica')
      .text(user.email)
      .moveDown(1.5);

    // Order Details
    pdfDoc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Order Details')
      .moveDown(0.5);

    order.products.forEach((prod) => {
      const itemTotal = prod.quantity * prod.product.price;

      pdfDoc
        .font('Helvetica')
        .fontSize(12)
        .text(
          `${prod.product.title} x ${prod.quantity} - $${prod.product.price} each`
        )
        .text(`Total: $${itemTotal.toFixed(2)}`)
        .moveDown(0.5);
    });

    // Total Price
    pdfDoc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Total Details', {
        align: 'right'
      })
      .font('Helvetica')
      .text(`Subtotal: $${order.totalDetails.subtotal.toFixed(2)}`, {
        align: 'right'
      })
      .text(`Tax: $${order.totalDetails.tax.toFixed(2)}`, {
        align: 'right'
      })
      .text(`Shipping: $${order.totalDetails.shipping.toFixed(2)}`, {
        align: 'right'
      })
      .moveDown(1)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(`Total: $${order.totalDetails.total.toFixed(2)}`, {
        align: 'right'
      })
      .moveDown(1);

    // Thank You Message
    pdfDoc
      .font('Helvetica')
      .fontSize(14)
      .text('Thank you for your purchase!', { align: 'center' })
      .moveDown(1);

    pdfDoc.end();
  } catch (err) {
    next(err);
  }
};
