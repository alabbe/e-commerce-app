// get request from routes and call services

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


module.exports = {
  findAll,
  findById
};