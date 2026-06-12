import Joi from 'joi';
import { objectId, password } from './custom.validation';

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.email().required(),
    password: Joi.string().custom(password).required(),
    role: Joi.string().valid('user', 'admin').default('user')
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

// const updateUser = {
//   params: Joi.object().keys({
//     userId: Joi.string().custom(objectId).required(),
//   }),
//   body: Joi.object().keys({
//     name: Joi.string().optional(),
//     email: Joi.email().optional(),
    
//   }),
// }

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

export default {
  createUser,
  getUser,
  deleteUser
};