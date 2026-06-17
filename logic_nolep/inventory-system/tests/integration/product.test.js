import request from 'supertest';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import { prisma } from '../../prisma/';
import { admin, userOne, insertUsers} from '../fixtures/user.fixture.js';
import { adminAccessToken, userOneAccessToken } from '../fixtures/token.fixture';
import { categoryOne, insertCategories } from '../fixtures/category.fixture';
import { createProductDummy, insertProducts } from '../fixtures/product.fixture';
import { jest, describe, it, expect } from '@jest/globals';

describe('Product Routes', () => {
  let newProduct;

  beforeEach(async () => {
    newProduct = {
      name: faker.commerce.productName(),
      price: 150000,
      stock: 50,
      description: faker.commerce.productDescription(),
    };
  });

  describe('POST /v1/product', () => {
    it('should return 201 and successfully create product if data is ok (Admin only)', async () => {
      await insertUsers([admin]);
      await insertCategories([categoryOne]);

      newProduct.categoryId = categoryOne.categoryId;

      const res = request(app)
        .post('/v1/product')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.CREATED);

      expect(res.body.data).toMatchObject({
        id: expect.any(String),
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
        description: newProduct.description,
        categoryId: newProduct.categoryId,
      });

      const dbProduct = await prisma.product.findUnique({
        where: { id: res.body.data.id },
      });
      expect(dbProduct).toBeDefined();
      expect(dbProduct.name).toBe(newProduct.name);
    });

    it('should return 403 Forbidden error if non-admin user tries to create a product', async () => {
      await insertUsers([userOne]);
      await insertCategories([categoryOne]);

      newProduct.categoryId = categoryOne.categoryId;

      const res = request(app)
        .post('/v1/product')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.FORBIDDEN);
    });

    it('should return 400 error if categoryId does not exist in database', async () => {
      await insertUsers([admin]);

      newProduct.categoryId = faker.string.uuid();

      const res = request(app)
        .post('/v1/product')
        .set('Authorize', `Bearer ${adminAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/product/:productId', () => {
    it('should return 200 and retrieve product detail by ID', async () => {
      await insertUsers([userOne]);
      await insertCategories([categoryOne]);

      const sampleProduct = createProductDummy(categoryOne.id);
      await insertProducts([sampleProduct]);

      const res = request(app)
        .get(`/v1/product/${sampleProduct.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data).toMatchObject({
        id: sampleProduct.id,
        name: sampleProduct.name,
      });
    });

    it('should return 404 error if product ID is not found', async () => {
      await insertUsers([userOne]);

      const randomProductId = faker.string.uuid();

      await request(app)
        .get(`/v1/product/${randomProductId}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});