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
  const products = await productService.getProducts();

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get products success',
    data: products
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
