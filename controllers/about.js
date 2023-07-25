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

exports.getContact = (req, res, next) => {
  res.render('about/contact', {
    pageTitle: 'Contact',
    path: '/contact',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.postContact = (req, res, next) => {
  try {
    const name = req.body.name;
    const message = `Thank you ${name} for contacting us! Our team will get back to you as soon as possible.`;

    res.render('about/thank-you', {
      pageTitle: 'Thank You',
      path: '/thank-you',
      message,
      user: req.user,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin
    });
  } catch (err) {
    next(err);
  }
};

exports.getCareers = (req, res, next) => {
  res.render('about/career', {
    pageTitle: 'Career',
    path: '/careers',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getPrivacy = (req, res, next) => {
  res.render('about/privacy', {
    pageTitle: 'Privacy Policy',
    path: '/privacy-policy',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.getTerms = (req, res, next) => {
  res.render('about/terms', {
    pageTitle: 'Terms & Conditions',
    path: '/terms-conditions',
    user: req.user,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
};

exports.postNewsletter = (req, res, next) => {
  try {
    const email = req.body.email.trim();
    const message = `Thank you ${email} from joining our newsletter!`;
    if (email.length > 0) {
      res.render('about/thank-you', {
        pageTitle: 'Thank You',
        path: '/thank-you',
        message,
        user: req.user,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin
      });
    } else {
      req.flash('error', 'Invalid email address');
      throw new Error('Invalid email address');
    }
  } catch (err) {
    next(err);
  }
};
