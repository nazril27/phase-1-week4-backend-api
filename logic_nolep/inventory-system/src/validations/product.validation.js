import Joi from 'joi';
import { objectId } from './custom.validation';

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    price: Joi.number().min(0).required(),
    quantityInStock: Joi.integer().min(0).required(),
    categoryId: Joi.string().custom(objectId).optional(),
    userId: Joi.string().custom(objectId).optional(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required()
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().optional(),
    description: Joi.string().allow('', null).optional(),
    price: Joi.number().min(0).optional(),
    quantityInStock: Joi.integer().min(0).optional(),
    categoryId: Joi.string().custom(objectId).allow('', null).optional(),
    userId: Joi.string().custom(objectId).allow('', null).optional()
  }).min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

export default {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct
};