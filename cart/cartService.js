const db = require('../db');

async function findByUser(userId) {
  try {
    const { rows } = await db.query('select * from carts where users_id = $1', [userId]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function findById(id) {
  try {
    const { rows } = await db.query('select * from carts where id = $1', [id]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function create(id) {
  try {
    const { rows } = await db.query('INSERT INTO carts(users_id) VALUES($1) RETURNING *', [id]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  findById,
  findByUser,
  create
}