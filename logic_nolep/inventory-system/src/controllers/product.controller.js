import { status } from 'http-status';
import catchAsync from '../utils/catchAsync';
import { productService } from '../service';

export const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Created product success',
    data: product
  });
});

export const getProducts = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const result = await productService.getProducts(page, size);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get products success',
    data: result.data,
    meta: result.meta,
  });
});

export const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get product success',
    data: product
  });
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Update product success',
    data: product
  });
});

export const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete product success',
    data: null
  });
});

export const getProductsByUser = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const result = await productService.getProductsByUser(req.params.userId, page, size);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get product by user success',
    data: result.data,
    meta: result.meta,
  });
});

export const searchProducts = catchAsync(async (req, res) => {
  const { q, page, size } = req.query;
  const result = await productService.searchProductsByCategory(q, page, size);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Search products by category success',
    data: result.data,
    meta: result.meta,
  });
});
