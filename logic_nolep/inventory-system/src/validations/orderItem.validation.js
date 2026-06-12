import { objectId } from "./custom.validation";
import Joi from 'joi';

const createOrderItem = {
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.integer().min(0).required(),
    unitPrice: Joi.number().min(0).required(),
  }),
};

const getOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId).required()
  }),
};

const updateOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId).optional(),
    productId: Joi.string().custom(objectId).optional(),
    quantity: Joi.integer().min(0).optional(),
    unitPrice: Joi.number().min(0).optional(),
  }),
};

const deleteOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId).required(),
  }),
};

export default {
  createOrderItem,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem
};