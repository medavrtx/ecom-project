const Product = require('../models/product');
const Order = require('../models/order');

exports.getHome = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/home', {
        products: products,
        pageTitle: 'ECOM',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/shop/' + prodId,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getInfo = (req, res, next) => {
  const isLoggedIn = req.get('Cookie')?.split('=')[1];
  res.render('shop/info', {
    pageTitle: 'Info',
    path: '/info',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items;
      let totalPrice = 0;
      let totalQty = 0;
      products.forEach(
        (p) =>
          (totalPrice += p.productId.price * p.quantity) &&
          (totalQty += p.quantity)
      );
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        totalPrice: totalPrice,
        totalQty: totalQty,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
    });
};

exports.getCheckout = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
      products: products,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
    });
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartUpdateProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const qty = req.body.qty;
  if (qty <= 0) {
    console.log("Qty can't be less than 1");
    res.redirect('/cart');
    return;
  }
  req.user
    .updateCart(prodId, qty)
    .then((result) => {
      console.log('Updated quantity!');
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
        createdAt: new Date(),
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};
