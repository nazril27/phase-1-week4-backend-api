import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { orderValidation } from '../../validations';
import * as orderController from '../../controllers/order.controller.js';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth(), orderController.getOrders);

router
  .route('/:orderId')
  .get(auth(), validate(orderValidation.getOrder), orderController.getOrderById)
  .patch(auth(), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth(), validate(orderValidation.deleteOrder), orderController.deleteOrder);

export default router;