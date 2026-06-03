import express from 'express';
import userRoute from './user.route.js';
import todoRoute from './todo.route.js';

const router = express.Router();

router.use('/users', userRoute);
router.use('/todos', todoRoute);

export default router;