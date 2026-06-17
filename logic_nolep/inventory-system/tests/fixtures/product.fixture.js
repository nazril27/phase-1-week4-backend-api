import { faker } from "@faker-js/faker";
import { prisma } from "../../prisma";

export const createProductDummy = (categoryId) => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price({ min: 10000, max: 500000 })),
  stock: faker.number.int({ min: 10, max: 100 }),
  description: faker.commerce.productDescription(),
  categoryId: categoryId,
});

export const insertProducts = async (products) => {
  await prisma.product.createMany({
    data: products,
  });
};