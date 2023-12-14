// get request from routes and call services

async function findAll(req, res, next) {
  try {
      //// call the service
      res.status(200).send('get all OK');
  } catch (err) {
      console.error(`Error while getting products`, err.message);
      next(err);
  }
}

async function findById(req, res, next) {
  try {
    const orderId = req.params.orderId;
    // call the service 
    res.status(200).send(orderId);
  } catch (err) {
      console.error(`Error while getting order by Id`, err.message);
      next(err);
  }
}


module.exports = {
  findAll,
  findById
};