const db = require('../db');

async function findById(productId) {
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE id=$1', [productId]);
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function findAll() {
  try {
    const { rows } = await db.query('SELECT * FROM products');
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

async function findByCategory(categoryId) {
  try {
    const { rows } = await db.query('SELECT * FROM products JOIN categories_products ON categories_products.products_id = products.id JOIN categories ON categories_products.categories_id = categories.id WHERE categories.id = $1', [categoryId]);
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
  findAll,
  findByCategory
}