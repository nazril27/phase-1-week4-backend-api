import express from 'express';
//import router from "./routes/index.js";
import config from './config/config.js';
import morgan from './config/morgan.js';
import { errorConverter, errorHandler } from './middlewares/error.js';
import ApiError from './utils/ApiError.js';
import { status } from 'http-status';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.use('/api', router);

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use((req, res, next) => {
  next(new ApiError(status.NOT_FOUND, 'Not Found'));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
