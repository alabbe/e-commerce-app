const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { PORT } = require('./config');
const productRouter = require('./product/productRoutes');
const userRouter = require('./user/userRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/products', productRouter);
app.use('/users', userRouter);

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