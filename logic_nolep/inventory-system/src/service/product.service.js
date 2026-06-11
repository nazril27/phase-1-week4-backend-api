import { status } from 'http-status';
import ApiError from '../utils/ApiError';
import { prisma } from '../../prisma/prisma.ts';

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  return prisma.product.create({
    data: productBody
  });
};

/**
 * Get products
 * @returns {Promise<Products>}
 */
const getProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
}

/**
 * Get a product
 * @param {ObjectId} productId
 * @returns {Promise<Product>} 
 */
const getProductById = async (productId) => {
  return await prisma.product.findFirst({
    where: {
      id: productId
    }
  });
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
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
const deleteProductById = async (productId) => {
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