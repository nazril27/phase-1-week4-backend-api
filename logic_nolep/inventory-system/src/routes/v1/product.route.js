import express from 'express';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import * as productController from '../../controllers/product.controller.js';
import { productValidation } from '../../validations/'

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(productValidation.createProduct), productController.createProduct)
  .get(auth(), productController.getProducts);

router
  .route('/users/:userId/products')
  .get(auth(), validate(productValidation.getProduct), productController.getProductsByUser);

router
  .route('/search')
  .get(auth(), productController.searchProducts);

router
  .route('/:productId')
  .get(auth(), validate(productValidation.getProduct), productController.getProductById)
  .patch(auth(), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth(), validate(productValidation.deleteProduct), productController.deleteProduct);

export default router;