import { status } from 'http-status';
import { prisma } from '../../prisma/prisma.ts';
import ApiError from '../utils/ApiError.js';

/**
 * Create an orderItem
 * @param {Object} orderItemBody
 * @returns {Promise<OrderItem>}
 */
export const createOrderItem = async (orderItemBody) => {
  const orderItem = await prisma.orderItem.create({
    data: orderItemBody
  });

  return orderItem;
}

/**
 * Get orderItems
 * @returns {Promise<OrderItems>}
 */
export const getOrderItems = async () => {
  return await prisma.orderItem.findMany();
};

/**
 * Get orderItem by id
 * @param {Object} orderItemId
 * @returns {Promise<OrderItem>}
 */
export const getOrderItemById = async (orderItemId) => {
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      id: orderItemId
    }
  });

  return orderItem;
}

/**
 * Update orderItem by id
 * @param {Object} orderItemId
 * @param {Object} updateBody
 * @returns {Promise<OrderItem>}
 */
export const updateOrderItemById = async (orderItemId, updateBody) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(status.NOT_FOUND, 'OrderItem not found');
  }

  const updateOrderItem = await prisma.orderItem.update({
    where: {
      id: orderItemId
    },
    data: updateBody
  });

  return updateOrderItem;
}

/**
 * Delete orderitem by id
 * @param {Object} orderItemId
 * @returns {Promise<OrderItem>}
 */
export const deleteOrderItemById = async (orderItemId) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(status.NOT_FOUND, 'OrderItem not found');
  }

  const deleteOrderItem = await prisma.orderItem.deleteMany({
    where: {
      id: orderItemId
    }
  });

  return deleteOrderItem;
}