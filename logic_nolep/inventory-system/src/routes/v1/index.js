import express from 'express';
import authRoute from './auth.route.js';
import categoryRoute from './category.route.js';
import productRoute from './product.route.js';
import orderRoute from './order.route.js';
import orderItemRoute from './orderItem.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/product',
    route: productRoute
  },
  {
    path: '/order',
    route: orderRoute
  },
  {
    path: '/orderItem',
    route: orderItemRoute
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
