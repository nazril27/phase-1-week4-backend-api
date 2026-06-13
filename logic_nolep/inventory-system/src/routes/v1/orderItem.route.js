import express from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import * as orderItemController from '../../controllers/orderItem.controller.js';
import { orderItemValidation } from '../../validations';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem)
  .get(auth(), orderItemController.getOrderItems);

router
  .route('/:orderItemId')
  .get(auth(), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItem)
  .patch(auth(), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
  .delete(auth(), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem);

export default router;