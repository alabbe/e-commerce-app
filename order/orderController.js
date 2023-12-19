const orderService = require('./orderService');
const userService = require('../user/userService');
const orderProductService = require('./orderProductService');

async function findAll(req, res, next) {
  try {
    const userId = req.query.user;
    if (!userId) {
      throw new HttpError('User Id is mandatory.', 400);
    }
    const user = await userService.findById(userId);
    if (!user) {
      throw new HttpError('User doesnt exist.', 404);
    }
    const orders = await orderService.findAll(userId);
    res.status(200).send(orders);
  } catch (err) {
    console.error(`Error while getting products`, err.message);
    next(err);
  }
}

async function findById(req, res, next) {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      throw new HttpError('Order Id is mandatory.', 400);
    }
    const order = await orderService.findById(orderId);
    order.products = await orderProductService.findByOrder(orderId);
    res.status(200).send(order);
  } catch (err) {
    console.error(`Error while getting order by Id`, err.message);
    next(err);
  }
}


module.exports = {
  findAll,
  findById
};