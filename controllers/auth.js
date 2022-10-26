exports.getSignIn = (req, res, next) => {
  const isLoggedIn = req.get('Cookie')?.split('=')[1];
  res.render('user/signin', {
    pageTitle: 'Sign In',
    path: '/user/signin',
    isAuthenticated: isLoggedIn,
    isAdmin: req.isAdmin,
  });
};

exports.postSignIn = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect('/');
};

exports.postLogOut = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=false');
  res.redirect('/');
};
