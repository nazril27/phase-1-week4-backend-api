import express from 'express';
import validate from '../../middlewares/validate.js';
import auth from '../../middlewares/auth.js';
import authorize from '../../middlewares/authorize.js';
import * as orderItemController from '../../controllers/orderItem.controller.js';
import { orderItemValidation } from '../../validations';

const router = express.Router();

router
  .route('/')
  .post(auth(), authorize('admin'), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem)
  .get(auth(), authorize('admin'), orderItemController.getOrderItems);

router
  .route('/orders/:orderId/order-items')
  .get(auth(), authorize('admin'), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItemsByOrders);

router
  .route('/:orderItemId')
  .get(auth(), authorize('admin'), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItem)
  .patch(auth(), authorize('admin'), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
  .delete(auth(), authorize('admin'), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem);

export default router;