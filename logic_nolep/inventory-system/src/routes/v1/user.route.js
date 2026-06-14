import express from 'express';
import auth from '../../middlewares/auth.js';
import authorize from '../../middlewares/authorize.js';
import validate from '../../middlewares/validate.js';
import * as userController from '../../controllers/user.controller.js';
import { userValidation } from '../../validations';

const router = express.Router();

router
  .route('/')
  .post(auth(), authorize('admin'), validate(userValidation.createUser), userController.createUser)
  .get(auth(), authorize('admin'), userController.getUsers);

router
  .route('/email/:userEmail')
  .get(auth(), authorize('admin'), validate(userValidation.getUser), userController.getUserByEmail);

router
  .route('/:userId')
  .get(auth(), authorize('admin'), validate(userValidation.getUser), userController.getUserById)
  .patch(auth(), authorize('admin'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), authorize('admin'), validate(userValidation.deleteUser), userController.deleteUser);

export default router;

