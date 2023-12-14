
async function findByUser(req, res, next) {
  try {
    const userId = req.params.userId;
      //// call the service
      res.status(200).send('get cart OK');
  } catch (err) {
      console.error(`Error while getting cart`, err.message);
      next(err);
  }
}

async function findById(req, res, next) {
  try {
    const cartId = req.params.cartId;
    // call the service 
    res.status(200).send(cartId);
  } catch (err) {
      console.error(`Error while getting order by Id`, err.message);
      next(err);
  }
}

async function create(req, res, next) {
  try {
      //// call the service
      res.status(200).send('create cart OK');
  } catch (err) {
      console.error(`Error while getting cart`, err.message);
      next(err);
  }
}

async function addProduct(req, res, next) {
}

async function removeProduct(req, res, next) {
}

module.exports = {
  findByUser,
  findById,
  create
};