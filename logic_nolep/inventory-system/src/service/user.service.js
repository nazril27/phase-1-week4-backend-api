import { status } from 'http-status';
import { prisma } from '../../prisma/prisma.ts';
import ApiError from '../utils/ApiError';
import bcrypt from 'bcryptjs';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  userBody.password = bcrypt.hashSync(userBody.password, 8);

  return prisma.user.create({
    data: userBody
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

/**
 * Get all user
 * @returns {Promise<Users>}
 */
const getUsers = async () => {
  return await prisma.user.findMany();
}

/**
 * Get user by id
 * @param {String} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId
    }
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }

  return user;
}

/**
 * Update user by id
 * @param {Object} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }

  const updateUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: updateBody
  });

  return updateUser;
};

/**
 * Delete user by id
 * @param {Object} userId
 * @returns {Promise<User>}
 */
const deleteUser = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }

  return await prisma.user.deleteMany({
    where: {
      id: userId
    }
  }); 
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUser,
  deleteUser
};