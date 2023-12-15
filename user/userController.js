const { HttpError } = require('../utils/http_error');
const userService = require('./userService');

async function findAll(req, res, next) {
  try {
    //// call the service which retrieves all users
    res.status(200).send('get all OK');
  } catch (err) {
    console.error(`Error while getting users`, err.message);
    next(err);
  }
}

async function findById(req, res, next) {
  try {
    const userId = req.params.productId;
    // call the service which retrieves the user by the given id
    res.status(200).send(userId);
  } catch (err) {
    console.error(`Error while getting user by Id`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new HttpError('Username and password are mandatory.', 400);
    }
    const alreadyExistsUser = userService.findByUsername(username);
    if (alreadyExistsUser) {
      throw new HttpError('User already exists.', 400);
    }

    const newUser = await userService.create(username, password);
    if (newUser) {
      res.status(201).send(newUser);
    }
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
}


module.exports = {
  findAll,
  findById,
  create
};