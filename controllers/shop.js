const Product = require('../models/product');

exports.getHome = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/home', {
        products: products,
        pageTitle: 'ECOM',
        path: '/',
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
    isAuthenticated: isLoggedIn,
    isAdmin: req.isAdmin,
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      let totalPrice = 0;
      let totalQty = 0;
      products.forEach(
        (p) => (totalPrice += p.price * p.quantity) && (totalQty += p.quantity)
      );
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        totalPrice: totalPrice,
        totalQty: totalQty,
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
      console.log(result);
      res.redirect('/cart');
    });
};

exports.getCheckout = (req, res, next) => {
  const isLoggedIn = req.get('Cookie')?.split('=')[1];
  Product.fetchAll((products) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
      products: products,
      isAuthenticated: isLoggedIn,
      isAdmin: req.isAdmin,
    });
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
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
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      if (qty <= 0) {
        product.cartItem.destroy();
      } else {
        product.cartItem.quantity = qty;
        product.cartItem.save();
      }
    })
    .then((result) => {
      console.log('Updated quantity!');
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};
