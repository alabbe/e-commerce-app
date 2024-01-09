const orderService = require('./orderService');
const userService = require('../user/userService');
const orderProductService = require('./orderProductService');
const { HttpError } = require("../utils/http_error");

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
    const orderId = Number(req.params.orderId);
    if (!orderId) {
      throw new HttpError('Order Id is mandatory.', 400);
    }
    const order = await orderService.findById(orderId);
    if (!order) {
      throw new HttpError('Order doesnt exist.', 404);
    }
    order.products = await orderProductService.findByOrder(orderId);
    res.status(200).send(order);
  } catch (err) {
    console.error(`Error while getting order by Id`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const orderId = Number(req.params.orderId);
    const { total, status } = req.body;
    if (!orderId) {
      throw new HttpError('Order Id is mandatory.', 400);
    }
    const checkOrderExists = await orderService.findById(orderId);
    if (!checkOrderExists) {
      throw new HttpError('Order doesnt exist.', 404);
    }
    const udpatedOrder = await orderService.update(total, status, orderId);
    udpatedOrder.products = await orderProductService.findByOrder(orderId);
    res.status(200).send(udpatedOrder);
  } catch (err) {
    console.error(`Error while updating order`, err.message);
    next(err);
  }
}


module.exports = {
  findAll,
  findById,
  update
};