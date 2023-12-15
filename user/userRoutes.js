const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.get('/', userController.findAll);
router.get('/:userId', userController.findById);
router.post('/register', userController.create);

module.exports = router;