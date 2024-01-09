const fakedb = require('../../db');

const createCart = async (userId) => {
  try {
    return await fakedb.query("INSERT INTO carts (users_id) VALUES($1) RETURNING *", [userId]);
  } catch (error) {
    console.log(error);
  }
}

const addProductToCart = async (cartId, productId, quantity) => {
  try {
    return await fakedb.query("INSERT INTO carts_products VALUES($1, $2, $3) RETURNING *", [cartId, productId, quantity]);
  } catch (error) {
    console.log(error);
  }
}

const dropCart = async () => {
  try {
    return await fakedb.query("TRUNCATE TABLE carts RESTART IDENTITY CASCADE");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createCart,
  addProductToCart,
  dropCart
}