import { prisma } from '../../prisma/prisma.ts';

export const getTodos = async () => {
  return prisma.todo.findMany({ include: { user: true } });
};

export const getTodoById = async (id) => {
  return prisma.todo.findUnique({ where: { id }, include: { user: true } });
};

export const createTodo = async (data) => {
  return prisma.todo.create({ data });
};

export const updateTodo = async (id, data) => {
  return prisma.todo.update({ where: { id }, data });
};

export const deleteTodo = async (id) => {
  return prisma.todo.delete({ where: { id } });
};
