const express = require('express');
const router = express.Router();
const cartController = require('./cartController');

router.get('/', cartController.findByUser);
router.get('/:cartId', cartController.findById);
router.post('/', cartController.create);
router.post('/products', cartController.addProduct);
router.put('/products/:productId', cartController.updateProduct);
router.delete('/products/:productId', cartController.removeProduct);

module.exports = router;