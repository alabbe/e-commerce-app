const express = require('express');
const router = express.Router();
const orderController = require('./orderController');

router.get('/', orderController.findAll);
router.get('/:orderId', orderController.findById);

module.exports = router;