import request from 'supertest';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import { prisma } from '../../prisma/';
import { admin, userOne, insertUsers } from '../fixtures/user.fixture.js';
import { adminAccessToken, userOneAccessToken } from '../fixtures/token.fixture';
import { categoryOne, insertCategories } from '../fixtures/category.fixture';
import { jest, describe, it, expect } from '@jest/globals';

describe('Category Routes', () => {
  let newCategory;

  beforeEach(async () => {
    newCategory = {
      name: faker.commerce.department(),
    };
  });

  describe('POST /v1/category', () => {
    it('should return 201 and successfully create category if data is ok (Admin only)', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/category')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newCategory)
        .expect(httpStatus.CREATED);

      expect(res.body.data).toMatchObject({
        id: expect.any(String),
        name: newCategory.name,
      });

      const dbCategory = await prisma.category.findUnique({
        where: { id: res.body.data.id },
      });

      expect(dbCategory).toBeDefined();
      expect(dbCategory.name).toBe(newCategory.name);
    });

    it('should return 403 Forbidden error if non-admin user tries to create a category', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/category')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newCategory)
        .expect(httpStatus.FORBIDDEN);
    });

    it('should return 400 error if category name is empty', async () => {
      await insertUsers([admin]);

      newCategory.name = '';

      const res = await request(app)
        .post('/v1/category')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newCategory)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /v1/category', () => {
    it('should return 200 and retrieve all categories (Public access)', async () => {
      await insertCategories([categoryOne]);
      await insertUsers([userOne]);

      const res = await request(app)
        .get('/v1/category')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toMatchObject({
        id: categoryOne.id,
        name: categoryOne.name,
      });
    });
  });
});
