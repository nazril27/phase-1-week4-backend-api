import { status } from 'http-status';
import { prisma } from '../../prisma/';
import ApiError from '../utils/ApiError.js';

/**
 * Create an orderItem
 * @param {Object} orderItemBody
 * @returns {Promise<OrderItem>}
 */
export const createOrderItem = async (orderItemBody) => {
  const { orderId, productId, quantity } = orderItemBody;

  return await prisma.$transaction(async (tx) => {
    // validate order exists
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new ApiError(status.NOT_FOUND, 'Order not found');
    }

    // fetch product and validate
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new ApiError(status.NOT_FOUND, 'Product not found');
    }

    if (product.quantityInStock < quantity) {
      throw new ApiError(status.BAD_REQUEST, 'Stok produk tidak cukup');
    }

    // derive unitPrice from product.price (trust server-side price)
    const unitPrice = product.price;

    const orderItem = await tx.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        unitPrice,
      },
    });

    // decrement product stock
    await tx.product.update({
      where: { id: productId },
      data: { quantityInStock: { decrement: quantity } },
    });

    return orderItem;
  });
}

/**
 * Get orderItems
 * @returns {Promise<OrderItems>}
 */
export const getOrderItems = async (page = 1, size = 10) => {
  const take = Number(size) > 0 ? Number(size) : 10;
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const skip = (currentPage - 1) * take;

  const [total, items] = await Promise.all([
    prisma.orderItem.count(),
    prisma.orderItem.findMany({ skip, take }),
  ]);

  const totalPages = Math.ceil(total / take) || 1;

  return { data: items, meta: { page: currentPage, size: take, total, totalPages } };
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

/**
 * Get orderItems by order
 * @param {ObjectId} orderId 
 * @returns {Promise<OrderItems>}
 */
export const getOrderItemsByOrders = async (orderId, page = 1, size = 10) => {
  const take = Number(size) > 0 ? Number(size) : 10;
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const skip = (currentPage - 1) * take;

  const where = { orderId };

  const [total, orderItems] = await Promise.all([
    prisma.orderItem.count({ where }),
    prisma.orderItem.findMany({ where, skip, take }),
  ]);

  const totalPages = Math.ceil(total / take) || 1;

  if (!orderItems) {
    throw new ApiError(status.NOT_FOUND, 'OrderItems not found');
  }

  return { data: orderItems, meta: { page: currentPage, size: take, total, totalPages } };
}