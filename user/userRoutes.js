const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.get('/', userController.findAll);
router.get('/:userId', userController.findById);

module.exports = router;