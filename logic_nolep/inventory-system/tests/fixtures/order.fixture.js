import { prisma } from "../../prisma";

export const getOrderWithItems = async (orderId) => {
  return await prisma.order.findUnique({
    where: { id: orderId},
    include: {
      items: true,
    },
  });
};