const path = require('path');
require('dotenv').config({ path: './.env.local' });

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const compression = require('compression');
const ejsMate = require('ejs-mate');

const errorController = require('./controllers/error');
const User = require('./models/user');

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const aboutRoutes = require('./routes/about');

app.use(compression());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  req.stripePk = process.env.STRIPEPK;
  req.stripeSk = process.env.STRIPESK;
  next();
});

app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          req.user = new User();
        } else {
          req.user = user;
        }
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } else {
    if (!req.session.temporaryCart) {
      req.session.temporaryCart = { items: [] };
    }
    req.user = req.session.temporaryCart;
    next();
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(aboutRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    user: req.user
  });
});

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URI, { maxPoolSize: 5 })
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
