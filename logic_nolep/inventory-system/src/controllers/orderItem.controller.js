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
  const { page, size } = req.query;
  const result = await orderItemService.getOrderItems(page, size);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get orderItems success',
    data: result.data,
    meta: result.meta,
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
});

export const getOrderItemsByOrders = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const result = await orderItemService.getOrderItemsByOrders(req.params.orderId, page, size);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get orderItems by order success',
    data: result.data,
    meta: result.meta,
  });
});