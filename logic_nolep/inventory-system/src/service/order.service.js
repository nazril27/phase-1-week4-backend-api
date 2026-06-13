import { prisma } from '../../prisma/prisma.ts';
import { status } from 'http-status';
import ApiError from '../utils/ApiError.js';

/**
 * Create an order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
export const createOrder = async (orderBody) => {
  return await prisma.order.create({
    data: orderBody
  });
};

/**
 * Get orders
 * @returns {Promise<Orders>}
 */
export const getOrders = async () => {
  const orders = await prisma.order.findMany();
  return orders;
}

/**
 * Get order by id
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
export const getOrderById = async (orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId
    }
  });

  if (!order) {
    throw new ApiError(status.NOT_FOUND, 'Order not found');
  }

  return order;
}

/**
 * Update order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
export const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(status.NOT_FOUND, 'Order not found');
  }

  const updateOrder = await prisma.order.update({
    where: {
      id: orderId
    },
    data: updateBody
  });

  return updateOrder;
}

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
export const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(status.NOT_FOUND, 'Order not found');
  }

  const deleteOrder = await prisma.order.deleteMany({
    where: {
      id: orderId
    }
  });

  return deleteOrder;
}