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
    const userId = req.params.userId;
    if (!userId) {
      throw new HttpError('User id is mandatory.', 400);
    }
    const foundUser = await userService.findById(userId);
    res.status(200).send(foundUser);
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

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new HttpError('Username and password are mandatory.', 400);
    }
    const user = await userService.findByUsername(username);
    if (!user) {
      throw new HttpError('User doesnt exist.', 404);
    }
    res.status(200).send(user);
  } catch (err) {
    console.error(`Error while logging user`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const userId = req.params.userId;
    const { password } = req.body;
    if (!userId) {
      throw new HttpError('User id is mandatory.', 400);
    }

    const updatedUser = await userService.update(password, userId);
    if (updatedUser) {
      res.status(200).send(updatedUser);
    }
  } catch (err) {
    console.error(`Error while updating user`, err.message);
    next(err);
  }
}


module.exports = {
  findAll,
  findById,
  create,
  login,
  update
};