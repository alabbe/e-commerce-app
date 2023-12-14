const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { PORT } = require('./config');
const productRouter = require('./product/productRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/products', productRouter);

async function startServer() {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  })
}

startServer();