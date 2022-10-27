const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
// const session = require('express-session');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const userRoutes = require('./routes/user');
// const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   session({ secret: 'mysecret', resave: false, saveUninitialized: false })
// );

app.use((req, res, next) => {
  User.findById('6359c0e86df0837fdf282f3b')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      console.log(req.user);
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/user', userRoutes);
// app.use(authRoutes);

app.use(errorController.get404);

mongoConnect((client) => {
  app.listen(3000);
});
