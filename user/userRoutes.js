const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.get('/', userController.findAll);
router.get('/:userId', userController.findById);
router.post('/register', userController.create);
router.post('/login', userController.login);
router.put('/:userId', userController.update);

module.exports = router;