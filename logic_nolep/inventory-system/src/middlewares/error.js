import { status } from 'http-status';
import config from '../config/config.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/client';

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    if (error.response) {

      const message = err.response.data.message || err.response.data;
      const statusCode = error.response.status;

      logger.info("handleAxiosError");
      error = new ApiError(statusCode, message, false, err.stack);

    } else if (err instanceof PrismaClientKnownRequestError) {

        logger.info("handlePrismaError");
        error = handlePrismaclientError(err);

    } else if (err instanceof PrismaClientInitializationError) {

        error = new ApiError(500, `Prisma Initialization Error: Database Connection Issues`);

    } else if (err instanceof PrismaClientValidationError) {

        console.error(':', err.message);
        error = new ApiError(500, `Prisma Validation Error: Invalid Input Data`);

    } else {

        const statusCode = error.statusCode;
        const message = error.message || status[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);

    }
  }
  next(error);
}

const handlePrismaclientError = (err) => {
    switch (err.code) {
        case 'P2002':
            return new ApiError(400, `Duplicate field value: ${err.meta.target}`, false, err.stack);
        
        case 'P2014':
            return new ApiError(400, `Invalid ID: ${err.meta.target}`, false, err.stack);

        case 'P2003':
            return new ApiError(400, `Invalid input data: ${err.meta.target}`, false, err.stack);

        default:
            return new ApiError(500, `Something went wrong: ${err.message}`, false, err.stack);
    }
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = status[status.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack }),
    };

    if (config.env === 'development') {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };