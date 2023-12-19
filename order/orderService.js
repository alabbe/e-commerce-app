const db = require('../db');

async function create(userId, total, status) {
  try {
    const { rows } = await db.query('INSERT INTO orders (users_id, total, status) VALUES($1, $2, $3) RETURNING *', [userId, total, status]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function findAll(userId) {
  try {
    const { rows } = await db.query('SELECT * FROM orders WHERE users_id = $1', [userId]);
    if (rows.length) {
      return rows;
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function findById(orderId) {
  try {
    const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function update(total, status, orderId) {
  try {
    const { rows } = await db.query('UPDATE orders SET total = $1, status = $2 WHERE id = $3 RETURNING *', [total, status, orderId]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports =  {
  create,
  findAll,
  findById,
  update
}