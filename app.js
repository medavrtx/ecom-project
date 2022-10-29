const path = require('path');
require('dotenv').config({ path: './.env.local' });

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
// const session = require('express-session');

const errorController = require('./controllers/error');
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
  User.findById('635c660210f1950b671dc5df')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/user', userRoutes);
// app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'B',
          email: 'b@gmail.com',
          cart: { items: [] },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
