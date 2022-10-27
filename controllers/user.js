exports.getUser = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1];
  res.render('user/index', {
    pageTitle: 'Cart',
    path: '/user',
    isAuthenticated: isLoggedIn,
    isAdmin: req.isAdmin,
  });
};

exports.getOrders = (req, res, next) => {
  const isLoggedIn = req.get('Cookie')?.split('=')[1];
  req.user
    .getOrders()
    .then((orders) => {
      console.log(orders);
      res.render('user/orders', {
        path: '/user/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: isLoggedIn,
        isAdmin: req.isAdmin,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};
