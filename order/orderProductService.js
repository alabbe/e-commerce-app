const db = require('../db');

async function add(orderId, productId, quantity) {
  try {
    const { rows } = await db.query('INSERT INTO orders_products(orders_id, products_id, quantity) VALUES($1, $2, $3) RETURNING *', [orderId, productId, quantity]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function findByOrder(orderId) {
  try {
    const { rows } = await db.query('SELECT * FROM orders_products JOIN products on orders_products.products_id = products.id WHERE orders_id=$1', [orderId]);
    if (rows.length) {
      return rows;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  add,
  findByOrder
}