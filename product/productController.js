// get request from routes and call services

async function findAll(req, res, next) {
  try {
      //// call the service which retrieves all products
      res.status(200).send('get all OK');
  } catch (err) {
      console.error(`Error while getting products`, err.message);
      next(err);
  }
}

async function findById(req, res, next) {
  try {
    const productId = req.params.productId;
    // call the service which retrieves the product by the given id
    res.status(200).send(productId);
  } catch (err) {
      console.error(`Error while getting product by Id`, err.message);
      next(err);
  }
}


module.exports = {
  findAll,
  findById
};