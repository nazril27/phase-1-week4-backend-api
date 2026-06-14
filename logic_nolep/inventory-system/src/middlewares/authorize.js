import { status } from 'http-status';
import ApiError from '../utils/ApiError.js';

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(status.UNAUTHORIZED, 'Please authenticate'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(status.FORBIDDEN, 'Forbidden'));
  }

  return next();
};

export default authorize;
