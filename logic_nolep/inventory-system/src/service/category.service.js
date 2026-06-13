import { status } from 'http-status';
import { prisma } from '../../prisma/prisma.ts';
import ApiError from '../utils/ApiError.js';

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  return prisma.category.create({
    data: categoryBody
  });
};

/**
 * Query for categories
 * @returns {Promise<queryResult>}
 */
const queryCategories = async (filter, options) => {
  const categories = await prisma.category.findMany();
  return categories;
}

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {promise<category>}
 */
const getCategoryById = async (id) => {
  const category = await prisma.category.findFirst({
    where: {
      id: id
    }
  });

  if (!category) {
    throw new ApiError(status.NOT_FOUND, 'Category not found');
  }

  return category;
};

/**
 * Update category by id
 * @param {ObjectId} getCategoryById
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(status.NOT_FOUND, 'Category not found');
  }

  const updateCategory = await prisma.category.update({
    where: {
      id: categoryId
    },
    data: updateBody
  });

  return updateCategory;
}

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(status.NOT_FOUND, 'Category not found');
  }

  const deleteCategory = await prisma.category.deleteMany({
    where: {
      id: categoryId
    },
  });

  return deleteCategory;
}

export default {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
};
