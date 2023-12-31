const express = require('express');
/* const passport = require('passport');
const LocalStrategy = require('passport-local'); */
const bodyParser = require('body-parser');
const app = express();
const { PORT, DB } = require('./config');
const productRouter = require('./product/productRoutes');
const userRouter = require('./user/userRoutes');
const cartRouter = require('./cart/cartRoutes');
const orderRouter = require('./order/orderRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await findByUsername(username, password);
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  }
)); */
console.log('database name:', DB.PGDATABASE);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

 // Error Handler
 app.use((err, req, res, next) => {
  const { message, status } = err;
  return res.status(status).send({ message });
});

async function startServer() {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  })
}

startServer();

module.exports = app;