import request from 'supertest';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import { prisma } from '../../prisma/';
import { userOne, insertUsers } from '../fixtures/user.fixture.js';
import { userOneAccessToken } from '../fixtures/token.fixture.js';
import { categoryOne, insertCategories } from '../fixtures/category.fixture.js';
import { createProductDummy, insertProducts } from '../fixtures/product.fixture.js';
import { jest, describe, it, expect } from '@jest/globals';

describe('Order Routes', () => {
  let orderPayload;
  let sampleProduct;
  const STOK_AWAL = 50;
  const JUMLAH_BELI = 2;

  beforeEach(async () => {
    await insertUsers([userOne]);
    await insertCategories([categoryOne]);

    sampleProduct = createProductDummy(categoryOne.id);
    sampleProduct.stock = STOK_AWAL;
    await insertProducts([sampleProduct]);

    orderPayload = {
      items: [
        {
          productId: sampleProduct.id,
          quantity: JUMLAH_BELI
        }
      ]
    };
  });

  describe('POST /v1/order', () => {
    it('should return 201 and successfully create order and decrement product stock', async () => {
      const res = request(app)
        .post('/v1/order')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(orderPayload)
        .expect(httpStatus.CREATED);

      expect(res.body.data).toMatchObject({
        id: expect.any(String),
        userId: userOne.id,
      });

      const dbOrder = await prisma.order.findUnique({
        where: { id: res.body.data.id },
        include: { items: true }
      });
      expect(dbOrder).toBeDefined();
      expect(dbOrder.items).toHaveLength(1);
      expect(dbOrder.items[0].productId).toBe(sampleProduct.id);
      expect(dbOrder.items[0].quantity).toBe(JUMLAH_BELI);

      const updateProduct = await prisma.product.findUnique({
        where: { id: sampleProduct.id }
      });

      expect(updateProduct.stock).toBe(STOK_AWAL - JUMLAH_BELI);
    });

    it('should return 400 error if order quantity exceeds available product stock', async () => {
      orderPayload.items[0].quantity = 99;

      const res = await request(app)
        .post('/v1/order')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(orderPayload)
        .expect(httpStatus.BAD_REQUEST);
      
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 error if body items array is empty', async () => {
      orderPayload.items = [];

      await request(app)
        .post('/v1/order')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(orderPayload)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});