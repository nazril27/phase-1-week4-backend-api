import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import * as userController from '../../controllers/user.controller.js';
import { userValidation } from '../../validations';

const router = express.Router();

router
  .route('/')
  .get(auth(), userController.getUsers);

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUser), userController.getUserById)
  .patch(auth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), validate(userValidation.deleteUser), userController.deleteUser);

router
  .route('/:userEmail')
  .get(auth(), validate(userValidation.getUser), userController.getUserByEmail);

export default router;

