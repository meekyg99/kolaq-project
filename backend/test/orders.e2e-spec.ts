import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let customerToken: string;
  let adminToken: string;
  let orderId: string;
  let productId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    prisma = app.get(PrismaService);

    await app.init();

    // Get admin token
    const adminResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'admin@kolaqbitters.com',
        password: 'Kolaqbitters$',
      });
    adminToken = adminResponse.body.accessToken;

    // Create product
    const productResponse = await request(app.getHttpServer())
      .post('/api/v1/catalog/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Order Test Product ${Date.now()}`,
        category: 'bitters',
        prices: [{ currency: 'NGN', amount: 10000 }],
        stock: 100,
      });
    productId = productResponse.body.id;

    // Register customer
    const customerEmail = `orders-${Date.now()}@example.com`;
    const customerResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: customerEmail,
        password: 'Password123!',
        name: 'Order Test User',
      });
    customerToken = customerResponse.body.accessToken;

    // Create an order
    await request(app.getHttpServer())
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId, quantity: 2 });

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

  afterAll(async () => {
    await app.close();
  });

  describe('Customer Order Management', () => {
    it('should get customer orders', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get specific order details', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/orders/${orderId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', orderId);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('items');
      expect(response.body.items.length).toBeGreaterThan(0);
    });

    it('should track order status', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/orders/${orderId}/track`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timeline');
      expect(Array.isArray(response.body.timeline)).toBe(true);
    });

    it('should fail to access another customer order', async () => {
      // Create another customer
      const anotherEmail = `another-${Date.now()}@example.com`;
      const anotherResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: anotherEmail,
          password: 'Password123!',
          name: 'Another User',
        });

      await request(app.getHttpServer())
        .get(`/api/v1/orders/${orderId}`)
        .set('Authorization', `Bearer ${anotherResponse.body.accessToken}`)
        .expect(403);
    });
  });

  describe('Admin Order Management', () => {
    it('should get all orders as admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should update order status', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'PROCESSING',
          note: 'Order is being prepared',
        })
        .expect(200);

      expect(response.body.status).toBe('PROCESSING');
    });

    it('should add tracking information', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/admin/orders/${orderId}/tracking`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrier: 'DHL',
          trackingNumber: 'DHL123456789',
          trackingUrl: 'https://dhl.com/track/DHL123456789',
        })
        .expect(201);

      expect(response.body).toHaveProperty('trackingNumber', 'DHL123456789');
    });

    it('should get order statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/orders/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalOrders');
      expect(response.body).toHaveProperty('pendingOrders');
      expect(response.body).toHaveProperty('completedOrders');
      expect(response.body).toHaveProperty('totalRevenue');
    });
  });

  describe('Order Lifecycle', () => {
    it('should complete full order lifecycle', async () => {
      // 1. Update to PROCESSING
      await request(app.getHttpServer())
        .patch(`/api/v1/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'PROCESSING' })
        .expect(200);

      // 2. Update to SHIPPED
      await request(app.getHttpServer())
        .patch(`/api/v1/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'SHIPPED' })
        .expect(200);

      // 3. Update to DELIVERED
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'DELIVERED' })
        .expect(200);

      expect(response.body.status).toBe('DELIVERED');

      // 4. Verify customer can see completed order
      const customerResponse = await request(app.getHttpServer())
        .get(`/api/v1/orders/${orderId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(customerResponse.body.status).toBe('DELIVERED');
    });
  });

  describe('Order Cancellation', () => {
    let cancelOrderId: string;

    beforeEach(async () => {
      // Create new order for cancellation
      await request(app.getHttpServer())
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ productId, quantity: 1 });

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
      cancelOrderId = checkoutResponse.body.order.id;
    });

    it('should cancel order as customer', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/orders/${cancelOrderId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          reason: 'Changed my mind',
        })
        .expect(200);

      expect(response.body.status).toBe('CANCELLED');
    });

    it('should not cancel shipped order', async () => {
      // Ship the order first
      await request(app.getHttpServer())
        .patch(`/api/v1/admin/orders/${cancelOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'SHIPPED' });

      await request(app.getHttpServer())
        .post(`/api/v1/orders/${cancelOrderId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ reason: 'Changed my mind' })
        .expect(400);
    });
  });
});
