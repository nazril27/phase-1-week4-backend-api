import { faker } from "@faker-js/faker";
import { prisma } from "../../prisma";

export const categoryOne = {
  id: faker.string.uuid(),
  name: 'Electronics',
};

export const categoryTwo = {
  id: faker.string.uuid(),
  name: 'Books'
};

export const insertCategories = async (categories) => {
  await prisma.category.createMany({
    data: categories,
  });
};
