const fakedb = require('../../db');

const createOrder = async (userId, total, status) => {
  try {
    return await fakedb.query("INSERT INTO orders (users_id, total, status) VALUES($1, $2, $3) RETURNING *", [userId, total, status]);
  } catch (error) {
    console.log(error);
  }
}

const addProductToOrder = async (orderId, productId, quantity) => {
  try {
    return await fakedb.query("INSERT INTO orders_products VALUES($1, $2, $3) RETURNING *", [orderId, productId, quantity]);
  } catch (error) {
    console.log(error);
  }
}

const dropOrder = async () => {
  try {
    return await fakedb.query("TRUNCATE TABLE orders RESTART IDENTITY CASCADE");
    //return null;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createOrder,
  addProductToOrder,
  dropOrder
}