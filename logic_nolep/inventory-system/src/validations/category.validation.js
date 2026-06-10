import Joi from 'joi';
import { objectId } from './custom.validation';

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
  }).min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

export default {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory
};