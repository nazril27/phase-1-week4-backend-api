const express = require('express');
const todoRoute = require('./todo.route');
const userRoute = require('./user.route');

const router = express.Router();

router.use('/users', userRoute);
router.use('/todos', todoRoute);

module.exports = router;