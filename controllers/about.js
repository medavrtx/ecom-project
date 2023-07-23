exports.getBrand = (req, res, next) => {
  res.render('about/brand', {
    pageTitle: 'Brand',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getRoutine = (req, res, next) => {
  res.render('about/routine', {
    pageTitle: 'Routine',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getResearch = (req, res, next) => {
  res.render('about/research', {
    pageTitle: 'Research',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getUv = (req, res, next) => {
  res.render('about/uv', {
    pageTitle: 'UV Studies on Skin',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getOrganic = (req, res, next) => {
  res.render('about/organic', {
    pageTitle: 'Organic Ingredients for Skincare',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getSuccess = (req, res, next) => {
  res.render('about/success', {
    pageTitle: 'Success',
    path: '/',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getFaqs = (req, res, next) => {
  res.render('about/faq', {
    pageTitle: 'FAQs',
    path: '/faq',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.postNewsletter = (req, res, next) => {
  try {
    const email = req.body.email.trim();
    if (email.length > 0) {
      res.render('about/thank-you', {
        pageTitle: 'Thank You',
        path: '/thank-you',
        user: req.user,
        email,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin
      });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
};
