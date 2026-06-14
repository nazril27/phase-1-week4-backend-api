import express from 'express';
import auth from '../../middlewares/auth.js';
import authorize from '../../middlewares/authorize.js';
import validate from '../../middlewares/validate.js';
import { orderValidation } from '../../validations';
import * as orderController from '../../controllers/order.controller.js';

const router = express.Router();

router
  .route('/')
  .post(auth(), authorize('admin'), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth(), authorize('admin'), orderController.getOrders);

router
  .route('/users/:userId/orders')
  .get(auth(), authorize('admin'), validate(orderValidation.getOrder), orderController.getOrdersByUser);

router
  .route('/:orderId')
  .get(auth(), authorize('admin'), validate(orderValidation.getOrder), orderController.getOrderById)
  .patch(auth(), authorize('admin'), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth(), authorize('admin'), validate(orderValidation.deleteOrder), orderController.deleteOrder);

export default router;