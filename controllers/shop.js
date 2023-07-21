const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const BestSeller = require('../models/best-seller');

const ITEMS_PER_PAGE = 2;

exports.getHome = async (req, res, next) => {
  try {
    const bestSellers = await BestSeller.find()
      .populate('productId')
      .sort({ order: 1 });

    res.render('shop/home', {
      bestSellers,
      pageTitle: 'Luminae Skincare',
      path: '/',
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find();
    })
    .then((products) => {
      res.render('shop/shop-all', {
        products: products,
        pageTitle: 'Luminae Skincare | Shop All Products',
        path: '/',
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        csrfToken: req.csrfToken(),
        totalProducts: totalItems
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInfo = (req, res, next) => {
  res.render('shop/info', {
    pageTitle: 'Info',
    path: '/info',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getCart = (req, res, next) => {
  if (!req.user) {
    req.user = new User();
  }
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
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin
      });
    })
    .catch((err) => {
      console.log('ajslfsja');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!req.user) {
        console.log('no user');
        const user = new User({
          email: 'temporaryuser@example.com',
          password: 'temporarypassword',
          firstName: 'Temporary',
          lastName: 'User',
          isTemp: true,
          cart: { items: [] }
        });
        req.user = user;
      }
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
    });
};

exports.getCheckout = (req, res, next) => {
  const stripe = require('stripe')(req.stripeSk);
  let products;
  let total = 0;
  let totalQty = 0;
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      products = user.cart.items;
      products.forEach(
        (p) =>
          (total += p.productId.price * p.quantity) && (totalQty += p.quantity)
      );

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: {
          allowed_countries: ['US', 'CA']
        },
        shipping_options: [
          {
            shipping_rate_data: {
              tax_behavior: 'exclusive',
              type: 'fixed_amount',
              fixed_amount: {
                amount: 1000,
                currency: 'usd'
              },
              display_name: '$10',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 5
                },
                maximum: {
                  unit: 'business_day',
                  value: 7
                }
              }
            }
          }
        ],
        line_items: products.map((p) => {
          return {
            price_data: {
              tax_behavior: 'exclusive',
              currency: 'usd',
              unit_amount: parseInt(p.productId.price).toFixed(2) * 100,
              product_data: {
                name: p.productId.title,
                description: p.productId.description
              }
            },
            quantity: p.quantity
          };
        }),
        automatic_tax: {
          enabled: true
        },
        mode: 'payment',
        success_url:
          req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then((session) => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalPrice: total,
        totalQty: totalQty,
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        stripe: req.stripePk,
        sessionId: session.id
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      if (!products.length) {
        return res.redirect('/cart');
      }
      console.log(products);
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products,
        createdAt: new Date()
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect(`/user/${req.user._id}/orders`);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      if (!products.length) {
        return res.redirect('/cart');
      }
      console.log(products);
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products,
        createdAt: new Date()
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
