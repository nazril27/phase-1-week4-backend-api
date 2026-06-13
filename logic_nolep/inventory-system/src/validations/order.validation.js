import { objectId } from "./custom.validation";
import Joi from 'joi';

const createOrder = {
  body: Joi.object().keys({
    date: Joi.date().required(),
    totalPrice: Joi.number().min(0).required(),
    customerName: Joi.string().required(),
    customerEmail: Joi.string().email().required(),
    userId: Joi.string().custom(objectId).required(),
  }),
}

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required()
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required()
  }),
  body: Joi.object().keys({
    date: Joi.date().optional(),
    totalPrice: Joi.number().min(0).optional(),
    customerName: Joi.string().optional(),
    customerEmail: Joi.string().email().optional(),
    userId: Joi.string().custom(objectId).optional(),
  }).min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required()
  }),
};

export default {
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder
};