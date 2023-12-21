const fakedb = require('../../db');

const createCategory = async (categoryName) => {
  try {
    return await fakedb.query("INSERT INTO categories (name) VALUES($1) RETURNING *", [categoryName]);
  } catch (error) {
    console.log(error);
  }
}

const createProduct = async (name, description, price) => {
  try {
    return await fakedb.query("INSERT INTO products (name, description, price) VALUES($1, $2, $3) RETURNING *", [name, description, price]);
  } catch (error) {
    console.log(error);
  }
}

const addCategoryToProduct = async (categoryId, productId) => {
  try {
    return await fakedb.query("INSERT INTO categories_products VALUES($1, $2) RETURNING *", [categoryId, productId]);
  } catch (error) {
    console.log(error);
  }
}

const dropProductAndCategory = async () => {
  try {
    await fakedb.query("TRUNCATE TABLE categories RESTART IDENTITY CASCADE");
    await fakedb.query("TRUNCATE TABLE products RESTART IDENTITY CASCADE");
    return null;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createProduct,
  createCategory,
  addCategoryToProduct,
  dropProductAndCategory
}