const db = require('../db');

async function add(cartId, productId, quantity) {
  try {
    const { rows } = await db.query('INSERT INTO carts_products(carts_id, products_id, quantity) VALUES($1, $2, $3) RETURNING *', [cartId, productId, quantity]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function findByCart(cartId) {
  try {
    const { rows } = await db.query('SELECT * FROM carts_products JOIN products on carts_products.products_id = products.id WHERE carts_id=$1', [cartId]);
    if (rows.length) {
      return rows;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function update(cartId, productId, quantity) {
  try {
    const { rows } = await db.query('UPDATE carts_products SET quantity = $1 WHERE carts_id = $2 AND products_id = $3 RETURNING *', [quantity, cartId, productId]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function remove(cartId, productId) {
  try {
    const { rows } = await db.query('DELETE FROM carts_products WHERE carts_id = $1 AND products_id = $2 RETURNING *', [cartId, productId]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  add,
  update,
  remove,
  findByCart
}