import { prisma } from '../../prisma/prisma.ts';

export const getUsers = async () => {
  return prisma.user.findMany({ include: { todos: true } });
};

export const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id }, include: { todos: true } });
};

export const createUser = async (data) => {
  return prisma.user.create({ data });
};

export const updateUser = async (id, data) => {
  return prisma.user.update({ where: { id }, data });
}

export const deleteUser = async (id) => {
  return prisma.user.delete({ where: { id } });
}
