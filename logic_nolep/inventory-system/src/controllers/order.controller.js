import { status } from 'http-status';
import catchAsync from '../utils/catchAsync';
import { orderService } from '../service';

export const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);

  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Created order success',
    data: order
  });
});

export const getOrders = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const result = await orderService.getOrders(page, size);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get orders success',
    data: result.data,
    meta: result.meta,
  });
});

export const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get order success',
    data: order
  });
});

export const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Update order success',
    data: order
  });
});

export const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'delete order success',
    data: null
  });
});

export const getOrdersByUser = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const result = await orderService.getOrdersByUser(req.params.userId, page, size);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get orders by user success',
    data: result.data,
    meta: result.meta,
  });
});