const cartService = require('./cartService');
const cartProductService = require('./cartProductService');
const userService = require('../user/userService');
const { HttpError } = require("../utils/http_error");

async function findByUser(req, res, next) {
  try {
    const userId = req.query.user;
    if (!userId) {
      throw new HttpError('User Id is mandatory.', 400);
    }
    const user = await userService.findById(userId);
    if (!user) {
      throw new HttpError('User doesnt exist.', 404);
    }
    const cart = await cartService.findByUser(userId);
    cart.products = await cartProductService.findByCart(cart.id);
    res.status(200).send(cart);
  } catch (err) {
    console.error(`Error while getting cart by user`, err.message);
    next(err);
  }
}

async function findById(req, res, next) {
  try {
    const cartId = req.params.cartId;
    if (!cartId) {
      throw new HttpError('Cart Id is mandatory.', 400);
    }
    const cart = await cartService.findById(cartId);
    cart.products = await cartProductService.findByCart(cartId);
    res.status(200).send(cart);
  } catch (err) {
    console.error(`Error while getting cart by Id`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const userId = req.query.user;
    if (!userId) {
      throw new HttpError('User Id is mandatory.', 400);
    }
    const user = await userService.findById(userId);
    if (!user) {
      throw new HttpError('User doesnt exist.', 404);
    }
    // recuperer le panier si il existe deja
    const cart = await cartService.findByUser(userId);
    if (!cart) {
      cart = await cartService.create(userId);
    }
    res.status(200).send(cart);
  } catch (err) {
    console.error(`Error while creating cart`, err.message);
    next(err);
  }
}

async function addProduct(req, res, next) {
  try {
    // recuperer le user
    const userId = req.query.user;
    const { productId, quantity } = req.body;
    if (!userId) {
      throw new HttpError('User Id is mandatory.', 400);
    }
    const user = await userService.findById(userId);
    if (!user) {
      throw new HttpError('User doesnt exist.', 404);
    }
    // recuperer le panier
    const cart = await cartService.findByUser(userId);
    if (!cart) {
      throw new HttpError('No cart found for this user.', 404);
    }
    const newproduct = await cartProductService.add(cart.id, productId, quantity);
    res.status(200).send(newproduct);
  } catch (err) {
    console.error(`Error while adding product to cart`, err.message);
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    // recuperer le user
    const userId = req.query.user;
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    if (!userId) {
      throw new HttpError('User Id is mandatory.', 400);
    }
    const user = await userService.findById(userId);
    if (!user) {
      throw new HttpError('User doesnt exist.', 404);
    }
    // recuperer le panier
    const cart = await cartService.findByUser(userId);
    if (!cart) {
      throw new HttpError('No cart found for this user.', 404);
    }
    const updatedProduct = await cartProductService.update(cart.id, productId, quantity);
    res.status(200).send(updatedProduct);
  } catch (err) {
    console.error(`Error while updating product in cart`, err.message);
    next(err);
  }
}

async function removeProduct(req, res, next) {
  try {
    const userId = req.query.user;
    const productId = req.params.productId;
    if (!userId) {
      throw new HttpError('User Id is mandatory.', 400);
    }
    const user = await userService.findById(userId);
    if (!user) {
      throw new HttpError('User doesnt exist.', 404);
    }
    const cart = await cartService.findByUser(userId);
    if (!cart) {
      throw new HttpError('No cart found for this user.', 404);
    }
    const removedProduct = await cartProductService.remove(cart.id, productId);
    res.status(200).send(removedProduct);
  } catch (err) {
    console.error(`Error while deleting product from cart`, err.message);
    next(err);
  }
}


module.exports = {
  findByUser,
  findById,
  create,
  addProduct,
  updateProduct,
  removeProduct
};