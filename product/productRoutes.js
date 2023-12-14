const express = require('express');
const router = express.Router();
const productController = require('./productController');

router.get('/', productController.findAll);
router.get('/:productId', productController.findById);

module.exports = router;