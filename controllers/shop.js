const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getHome = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/home', {
        products: products,
        pageTitle: 'ECOM',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      res.render('shop/product-detail', {
        product: products[0],
        pageTitle: products[0].title,
        path: '/shop/' + prodId,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getInfo = (req, res, next) => {
  res.render('shop/info', {
    pageTitle: 'Info',
    path: '/info',
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          let totalPrice = 0;
          let totalQty = 0;
          products.forEach(
            (p) =>
              (totalPrice += p.price * p.cartItem.quantity) &&
              (totalQty += p.cartItem.quantity)
          );
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products,
            totalPrice: totalPrice,
            totalQty: totalQty,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
      products: products.reverse(),
    });
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
      products: products.reverse(),
    });
  });
};
