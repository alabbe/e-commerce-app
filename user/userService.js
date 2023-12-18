const db = require('../db');

async function create(username, password) {
  try {
    const { rows } = await db.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING *', [username, password]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function findByUsername(username) {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE username=$1', [username]);
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
    const { rows } = await db.query('SELECT * FROM users WHERE id=$1', [id]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function update(password, id) {
  try {
    const { rows } = await db.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING *', [password, id]);
    console.log(rows);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  create,
  findByUsername,
  findById,
  update
}