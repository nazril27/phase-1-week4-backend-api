import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import * as productController from '../../controllers/product.controller.js';
import { productValidation } from '../../validations/'

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(productValidation.createProduct), productController.createProduct)
  .get(auth(), productController.getProducts);

router
  .route('/:productId')
  .get(auth(), validate(productValidation.getProduct), productController.getProductById)
  .patch(auth(), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth(), validate(productValidation.deleteProduct), productController.deleteProduct);

  export default router;