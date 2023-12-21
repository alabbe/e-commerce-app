const productService = require('./productService');
const { HttpError } = require("../utils/http_error");

/* async function findAll(req, res, next) {
  try {
    const products = productService.findAll();
    if (products.length) {
      res.status(200).send(products);
    } else {
      throw new HttpError('No products found', 404);
    }
  } catch (err) {
      console.error(`Error while getting products`, err.message);
      next(err);
  }
} */

async function findById(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    // call the service which retrieves the product by the given id
    if (!productId) {
      throw new HttpError('Product Id is mandatory.', 400);
    }
    const product =  await productService.findById(productId);
    if (!product) {
      throw new HttpError('Product doesnt exist.', 404);
    }
    res.status(200).send(product);
  } catch (err) {
      console.error(`Error while getting product by Id`, err.message);
      next(err);
  }
}

async function findByCategory(req, res, next) {
  try {
    const categoryId = Number(req.query.category);
    if (!categoryId) {
      throw new HttpError('Category Id is mandatory.', 400);
    }
    const products = await productService.findByCategory(categoryId);
      res.status(200).send(products);
  } catch (err) {
      console.error(`Error while getting product by Id`, err.message);
      next(err);
  }
}


module.exports = {
  findById,
  findByCategory
};