import { status } from 'http-status';
import ApiError from '../utils/ApiError';
import { prisma } from '../../prisma/';

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
export const createProduct = async (productBody) => {
  return prisma.product.create({
    data: productBody
  });
};

/**
 * Get products
 * @returns {Promise<Products>}
 */
export const getProducts = async (page = 1, size = 10) => {
  const take = Number(size) > 0 ? Number(size) : 10;
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const skip = (currentPage - 1) * take;

  const [total, products] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({ skip, take }),
  ]);

  const totalPages = Math.ceil(total / take) || 1;

  return {
    data: products,
    meta: { page: currentPage, size: take, total, totalPages },
  };
}

/**
 * Get a product
 * @param {ObjectId} productId
 * @returns {Promise<Product>} 
 */
export const getProductById = async (productId) => {
  const product =  await prisma.product.findFirst({
    where: {
      id: productId
    }
  });

  if (!product) {
    throw new ApiError(status.NOT_FOUND, 'Prouduct not found');
  }

  return product;
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
export const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(status.NOT_FOUND, 'Product not found');
  }

  const updateProduct = await prisma.product.update({
    where: {
      id: productId
    },
    data: updateBody
  });

  return updateProduct;
}

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
export const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(status.NOT_FOUND, 'Product not found');
  }

  const deleteProduct = await prisma.product.deleteMany({
    where: {
      id: productId
    }
  });

  return deleteProduct;
}

/**
 * Get products by email
 * @param {ObjectId} userId 
 * @returns {Promise<Products>}
 */
export const getProductsByUser = async (userId, page = 1, size = 10) => {
  const take = Number(size) > 0 ? Number(size) : 10;
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const skip = (currentPage - 1) * take;

  const where = { userId };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, skip, take }),
  ]);

  const totalPages = Math.ceil(total / take) || 1;

  if (!products) {
    throw new ApiError(status.NOT_FOUND, 'Products not found');
  }

  return { data: products, meta: { page: currentPage, size: take, total, totalPages } };
};

/**
 * Search products by category name (text search)
 * @param {string} categoryName
 * @returns {Promise<Products>}
 */
export const searchProductsByCategory = async (categoryName = '', page = 1, size = 10) => {
  const take = Number(size) > 0 ? Number(size) : 10;
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const skip = (currentPage - 1) * take;

  const where = {
    category: {
      name: {
        contains: categoryName,
        mode: 'insensitive',
      },
    },
  };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, skip, take }),
  ]);

  const totalPages = Math.ceil(total / take) || 1;

  return { data: products, meta: { page: currentPage, size: take, total, totalPages } };
};