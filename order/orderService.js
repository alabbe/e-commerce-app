const db = require('../db');

async function create(userId, total) {
  try {
    const { rows } = await db.query('INSERT INTO orders (users_id, total) VALUES($1, $2) RETURNING *', [userId, total]);
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

module.exports =  {
  create,
  findAll,
  findById
}