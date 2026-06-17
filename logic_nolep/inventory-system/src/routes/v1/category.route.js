import express from 'express';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import { categoryValidation } from '../../validations/';
import categoryController from '../../controllers/category.controller.js';
import authorize from '../../middlewares/authorize.js';

const router = express.Router();

router
  .route('/')
  .post(auth(), authorize('admin'), validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(auth(), categoryController.getCategories);

router
  .route('/:categoryId')
  .get(auth(), validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(auth(), authorize('admin'), validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(auth(), authorize('admin'), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

export default router;