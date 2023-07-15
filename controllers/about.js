exports.getBrand = (req, res, next) => {
  res.render('about/brand', {
    pageTitle: 'Info',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getRoutine = (req, res, next) => {
  res.render('about/routine', {
    pageTitle: 'Info',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getResearch = (req, res, next) => {
  res.render('about/research', {
    pageTitle: 'Info',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getIngredients = (req, res, next) => {
  res.render('about/ingredients', {
    pageTitle: 'Info',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getSuccess = (req, res, next) => {
  res.render('about/success', {
    pageTitle: 'Info',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};
