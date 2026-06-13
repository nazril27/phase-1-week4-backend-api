import { status } from 'http-status';
import catchAsync from '../utils/catchAsync';
import { orderItemService } from '../service';

export const createOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.createOrderItem(req.body);

  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Create orderItem success',
    data: orderItem
  });
});

export const getOrderItems = catchAsync(async (req, res) => {
  const orderItems = await orderItemService.getOrderItems();

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get orderItems success',
    data: orderItems
  });
});

export const getOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get orderItem success',
    data: orderItem
  });
});

export const updateOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.updateOrderItemById(req.params.orderItemId, req.body);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Update orderItem success',
    data: orderItem
  });
});

export const deleteOrderItem = catchAsync(async (req, res) => {
  await orderItemService.deleteOrderItemById(req.params.orderItemId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete orderItem success',
    data: null
  });
})