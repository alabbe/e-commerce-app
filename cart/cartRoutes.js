const express = require('express');
const router = express.Router();
const cartController = require('./cartController');

router.get('/', cartController.findByUser);
router.get('/:cartId', cartController.findById);
router.post('/', cartController.create);

module.exports = router;