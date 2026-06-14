import { status } from 'http-status';
import { prisma } from '../../prisma/';
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
 * Get users with optional pagination
 * @param {number} page
 * @param {number} size
 * @returns {Promise<{data: User[], meta: Object}>}
 */
const getUsers = async (page = 1, size = 10) => {
  const take = Number(size) > 0 ? Number(size) : 10;
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const skip = (currentPage - 1) * take;

  const [total, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({ skip, take }),
  ]);

  const totalPages = Math.ceil(total / take) || 1;

  return {
    data: users,
    meta: {
      page: currentPage,
      size: take,
      total,
      totalPages,
    },
  };
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