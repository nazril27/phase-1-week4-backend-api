import { status } from 'http-status';
import catchAsync from '../utils/catchAsync';
import { categoryService } from '../service';

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Create Category Success',
    data: category
  });
});

const getCategories = catchAsync(async (req, res) => {
  const result = await categoryService.queryCategories();

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Categories Success',
    data: result
  });
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Category Success',
    data: category
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Update Category Success',
    data: category
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete Category Success',
    data: null
  });
});

export default {
  createCategory,
  getCategories, 
  getCategory,
  updateCategory,
  deleteCategory
};