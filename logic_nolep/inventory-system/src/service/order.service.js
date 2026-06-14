import { prisma } from '../../prisma/';
import { status } from 'http-status';
import ApiError from '../utils/ApiError.js';

/**
 * Create an order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
export const createOrder = async (orderBody) => {
  const { orderItems = [], ...orderData } = orderBody;

  return await prisma.$transaction(async (tx) => {
    // fetch products involved
    const productIds = orderItems.map((it) => it.productId);
    const products = productIds.length
      ? await tx.product.findMany({ where: { id: { in: productIds } } })
      : [];

    // validate products exist
    if (productIds.length && products.length !== productIds.length) {
      throw new ApiError(status.NOT_FOUND, 'One or more products not found');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // validate stock and compute totalPrice using product price from DB
    let totalPrice = 0;
    const itemsToCreate = orderItems.map((it) => {
      const prod = productMap.get(it.productId);
      if (!prod) {
        throw new ApiError(status.NOT_FOUND, 'Product not found');
      }
      if (prod.quantityInStock < it.quantity) {
        throw new ApiError(status.BAD_REQUEST, `Stok tidak cukup untuk produk ${it.productId}`);
      }

      const unitPrice = prod.price;
      totalPrice += unitPrice * it.quantity;

      return {
        productId: it.productId,
        quantity: it.quantity,
        unitPrice,
      };
    });

    const order = await tx.order.create({
      data: {
        ...orderData,
        totalPrice,
        orderItems: {
          create: itemsToCreate.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
        },
      },
      include: { orderItems: true },
    });

    // decrement stock for each product
    await Promise.all(
      itemsToCreate.map((it) =>
        tx.product.update({
          where: { id: it.productId },
          data: { quantityInStock: { decrement: it.quantity } },
        })
      )
    );

    return order;
  });
};

/**
 * Get orders
 * @returns {Promise<Orders>}
 */
export const getOrders = async (page = 1, size = 10) => {
  const take = Number(size) > 0 ? Number(size) : 10;
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const skip = (currentPage - 1) * take;

  const [total, orders] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ skip, take }),
  ]);

  const totalPages = Math.ceil(total / take) || 1;

  return { data: orders, meta: { page: currentPage, size: take, total, totalPages } };
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

/**
 * Get orders by user
 * @param {ObjectId} userId 
 * @returns {Promise<Orders>}
 */
export const getOrdersByUser = async (userId, page = 1, size = 10) => {
  const take = Number(size) > 0 ? Number(size) : 10;
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const skip = (currentPage - 1) * take;

  const where = { userId };

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({ where, skip, take }),
  ]);

  const totalPages = Math.ceil(total / take) || 1;

  if (!orders) {
    throw new ApiError(status.NOT_FOUND, 'Orders not found');
  }

  return { data: orders, meta: { page: currentPage, size: take, total, totalPages } };
};