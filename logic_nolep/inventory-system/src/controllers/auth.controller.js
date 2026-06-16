import { status } from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import { authService, userService, tokenService } from '../service';
import ApiError from '../utils/ApiError.js';

const register = catchAsync(async (req, res) => {
  const existingUser = await userService.getUserByEmail(req.body.email);

  if (existingUser) {
    throw new ApiError(status.BAD_REQUEST, 'Email already taken');
  }

  const userCreated = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(userCreated);

  res.status(status.CREATED).send({ user: userCreated, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  delete user.password;

  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  await tokenService.revokeToken(refreshToken, 'refresh');
  res.status(status.NO_CONTENT).send();
});

export default {
  register,
  login,
  logout,
};