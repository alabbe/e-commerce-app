const fakedb = require('../../db');

const createUser = async (username, passsword) => {
  try {
    return await fakedb.query("INSERT INTO users (username, password) VALUES($1, $2) RETURNING *", [username, passsword]);
  } catch (error) {
    console.log(error);
  }
}

const dropUser = async () => {
  try {
    await fakedb.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
    return null;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createUser,
  dropUser
}