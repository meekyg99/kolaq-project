import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Cart & Checkout (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let customerToken: string;
  let adminToken: string;
  let productId: string;
  let cartId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    prisma = app.get(PrismaService);

    await app.init();

    // Get admin token and create a product
    const adminResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'admin@kolaqbitters.com',
        password: 'Kolaqbitters$',
      });
    adminToken = adminResponse.body.accessToken;

    const productResponse = await request(app.getHttpServer())
      .post('/api/v1/catalog/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Checkout Test Product ${Date.now()}`,
        description: 'Product for checkout testing',
        category: 'bitters',
        prices: [
          { currency: 'NGN', amount: 10000 },
          { currency: 'USD', amount: 25 },
        ],
        stock: 100,
      });
    productId = productResponse.body.id;

    // Register customer
    const customerEmail = `checkout-${Date.now()}@example.com`;
    const customerResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: customerEmail,
        password: 'Password123!',
        name: 'Checkout Test User',
      });
    customerToken = customerResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Cart Management', () => {
    it('should create a cart', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/cart')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          currency: 'NGN',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.currency).toBe('NGN');
      cartId = response.body.id;
    });

    it('should add item to cart', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          productId,
          quantity: 2,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].quantity).toBe(2);
      expect(response.body.items[0].productId).toBe(productId);
    });

    it('should get current cart', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body).toHaveProperty('totalAmount');
    });

    it('should update cart item quantity', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/v1/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          productId,
          quantity: 3,
        })
        .expect(200);

      expect(response.body.items[0].quantity).toBe(3);
    });

    it('should remove item from cart', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/cart/items/${productId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      const response = await request(app.getHttpServer())
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.body.items).toHaveLength(0);
    });
  });

  describe('Checkout Flow', () => {
    beforeEach(async () => {
      // Add item to cart for each test
      await request(app.getHttpServer())
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          productId,
          quantity: 2,
        });
    });

    it('should create checkout session', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/checkout/session')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            street: '123 Test Street',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            postalCode: '100001',
          },
          billingAddress: {
            street: '123 Test Street',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            postalCode: '100001',
          },
        })
        .expect(201);

      expect(response.body).toHaveProperty('sessionId');
      expect(response.body).toHaveProperty('order');
      expect(response.body.order.status).toBe('PENDING');
    });

    it('should fail checkout with empty cart', async () => {
      // Clear cart
      await request(app.getHttpServer())
        .delete(`/api/v1/cart/items/${productId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      await request(app.getHttpServer())
        .post('/api/v1/checkout/session')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            street: '123 Test Street',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            postalCode: '100001',
          },
        })
        .expect(400);
    });
  });

  describe('Payment Processing', () => {
    let orderId: string;

    beforeEach(async () => {
      // Create order
      await request(app.getHttpServer())
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          productId,
          quantity: 1,
        });

      const checkoutResponse = await request(app.getHttpServer())
        .post('/api/v1/checkout/session')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            street: '123 Test Street',
            city: 'Lagos',
            state: 'Lagos',
            country: 'Nigeria',
            postalCode: '100001',
          },
        });
      orderId = checkoutResponse.body.order.id;
    });

    it('should get payment methods', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/checkout/payment-methods')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should process payment (test mode)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/checkout/process-payment')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          orderId,
          paymentMethod: 'paystack',
          provider: 'PAYSTACK',
        })
        .expect(201);

      expect(response.body).toHaveProperty('paymentUrl');
      expect(response.body).toHaveProperty('reference');
    });
  });
});
