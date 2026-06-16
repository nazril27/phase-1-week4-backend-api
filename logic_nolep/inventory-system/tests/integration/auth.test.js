import request from "supertest";
import { faker } from "@faker-js/faker";
import httpStatus from 'http-status'; 
import app from '../../src/app.js';
import { prisma } from "../../prisma/";
import { userOne, insertUsers } from "../fixtures/user.fixture.js";
import { jest, describe, it, expect } from '@jest/globals';

import auth from "../../src/middlewares/auth.js";
import { generateToken, userOneAccessToken } from '../fixtures/token.fixture.js';
import moment from "moment";
import tokenTypes from "../../src/config/tokens.js";
import ApiError from "../../src/utils/ApiError.js";
import jwt from 'jsonwebtoken';
import tokenService from "../../src/service/token.service.js";

describe('Auth Routes', () => {
  describe('POST /v1/auth/register', () => {
    let newUser;

    beforeEach(async () => {
      newUser = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password123'
      };
    });

    it('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.CREATED);

      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).toMatchObject({
        name: newUser.name,
        email: newUser.email,
        role: 'user',
        isEmailVerified: false,
      });

      expect(res.body.tokens).toHaveProperty('access');
      expect(res.body.tokens).toHaveProperty('refresh');

      const dbUser = await prisma.user.findUnique({
        where: { id: res.body.user.id },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser.email).toBe(newUser.email);
      expect(dbUser.name).toBe(newUser.name);

      expect(dbUser.password).not.toBe(newUser.password);
    });

    it('should return 400 error if email is invalid', async () => {
      newUser.email = 'invalid-email-format';

      await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return 400 error if email is already used', async () => {
      await insertUsers([userOne]);

      newUser.email = userOne.email;

      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        code: httpStatus.BAD_REQUEST,
        message: 'Email already taken'
      });
    });

    it('should return 400 error if password length is less than 8 characters', async () => {
      newUser.password = 'pass123';

      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        code: httpStatus.BAD_REQUEST,
        message: 'password must be at least 8 characters'
      });
    });

    it('should return 400 error if password does not contain both letters and numbers', async () => {
      newUser.password = 'passwordonly';

      let res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        code: httpStatus.BAD_REQUEST,
        message: 'password must contain at least one letter and one number'
      });

      newUser.password = '123456789';

      res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body).toMatchObject({
        code: httpStatus.BAD_REQUEST,
        message: 'password must contain at least one letter and one number'
      });
    });
  });

  describe('POST /v1/auth/login', () => {
    let loginCredentials;

    beforeEach(async () => {
      loginCredentials = {
        email: userOne.email,
        password: 'password1'
      };
    });

    it('should return 200 and login user if email and password match', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/v1/auth/login')
        .send(loginCredentials)
        .expect(httpStatus.OK)

      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).toMatchObject({
        id: userOne.id,
        name: userOne.name,
        email: userOne.email,
        role: userOne.role,
      });

      expect(res.body.tokens).toHaveProperty('access');
      expect(res.body.tokens).toHaveProperty('refresh');
    });

    it('should return 401 error if password is wrong', async () => {
      await insertUsers([userOne]);

      loginCredentials.password = 'wrong-password-123';

      const res = await request(app)
        .post('/v1/auth/login')
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED)

      expect(res.body).toMatchObject({
        code: httpStatus.UNAUTHORIZED,
        message: 'Incorrect email or password'
      });
    });
  });
});

describe('Auth Middlewares', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {};
    next = jest.fn();
  });

  it('should call next with no errors if access token is valid', async () => {
    await insertUsers([userOne]);

    // const accessTokenExpires = moment().add(30, 'minutes');
    // const validAccessToken = generateToken(userOne.id, accessTokenExpires, tokenTypes.ACCESS);

    req.headers.authorization = `Bearer ${userOneAccessToken}`;

    await auth()(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with unauthorized error if access token is not found in header', async () => {
    
    await auth()(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    const thrownError = next.mock.calls[0][0];
    expect(thrownError.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(thrownError.message).toBe('Please authenticate');
  });

  it('should call next with unauthorized error if access token is not a valid jwt token', async () => {
    req.headers.authorization = 'Bearer token-asal-asalan-bukan-jwt';

    await auth()(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));

    const thrownError =  next.mock.calls[0][0];
    expect(thrownError.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(thrownError.message).toBe('Please authenticate');
  });

  it('should call next with unauthorized error if the token is not an access token', async () => {
    await insertUsers([userOne]);

    const expires = moment().add(30, 'minutes');
    const refreshToken = tokenService.generateToken(userOne.id, expires, tokenTypes.REFRESH);

    req.headers.authorization = `Bearer ${refreshToken}`;

    await auth()(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const thrownError = next.mock.calls[0][0];
    expect(thrownError.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(thrownError.message).toBe('Please authenticate');
  });

  it('should call next with unauthorized error if access token is generated with an invalid secret', async () => {
    await insertUsers([userOne]);

    const expires = moment().add(30, 'minutes');
    const payload = {
      sub: userOne.id,
      iat: moment().unix(),
      exp: expires.unix(),
      type: tokenTypes.ACCESS,
    };
    const tokenWithWrongSecret = jwt.sign(payload, 'secret-palsu-bukan-punya-aplikasi'); 

    req.headers.authorization = `Bearer ${tokenWithWrongSecret}`;

    await auth()(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const thrownError = next.mock.calls[0][0];
    expect(thrownError.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should call next with unauthorized error if access token is expired', async () => {
    await insertUsers([userOne]);

    const expiredTime = moment().subtract(30, 'minutes');
    const expiredToken = tokenService.generateToken(userOne.id, expiredTime, tokenTypes.ACCESS);

    req.headers.authorization = `Bearer ${expiredToken}`;

    await auth()(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const thrownError = next.mock.calls[0][0];
    expect(thrownError.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should call next with unauthorized error if user is not found', async () => {
    
    // const expires = moment().add(30, 'minutes');
    // const validTokenButNotUser = generateToken(userOne.id, expires, tokenTypes.ACCESS);

    req.headers.authorization = `Bearer ${userOneAccessToken}`;

    await auth()(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const thrownError = next.mock.calls[0][0];
    expect(thrownError.statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(thrownError.message).toBe('Please authenticate');
  });
});