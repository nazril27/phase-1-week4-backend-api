import { userService } from '../service';
import { status } from 'http-status';
import catchAsync from "../utils/catchAsync";

export const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Create user success',
    data: user
  });
});

export const getUsers = catchAsync(async (req, res) => {
  const { page, size } = req.query;
  const result = await userService.getUsers(page, size);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get users success',
    data: result.data,
    meta: result.meta,
  });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get user by id success',
    data: user
  });
});

export const getUserByEmail = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.params.userEmail);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get user by email success',
    data: user
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.userId, req.body);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Update user success',
    data: user
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.userId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete user success',
    data: null
  });
})