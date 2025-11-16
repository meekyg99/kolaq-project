import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Admin Dashboard (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let customerToken: string;

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

    // Get customer token
    const customerEmail = `customer-${Date.now()}@example.com`;
    const customerResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: customerEmail,
        password: 'Password123!',
        name: 'Test Customer',
      });
    customerToken = customerResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Dashboard Statistics', () => {
    it('should get dashboard stats', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalRevenue');
      expect(response.body).toHaveProperty('totalOrders');
      expect(response.body).toHaveProperty('totalCustomers');
      expect(response.body).toHaveProperty('totalProducts');
    });

    it('should get sales analytics', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard/sales')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('daily');
      expect(response.body).toHaveProperty('weekly');
      expect(response.body).toHaveProperty('monthly');
    });

    it('should get inventory alerts', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard/inventory-alerts')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('lowStock');
      expect(response.body).toHaveProperty('outOfStock');
      expect(Array.isArray(response.body.lowStock)).toBe(true);
      expect(Array.isArray(response.body.outOfStock)).toBe(true);
    });

    it('should deny customer access to admin dashboard', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);
    });
  });

  describe('User Management', () => {
    it('should get all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter users by role', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/users?role=CUSTOMER')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((user: any) => {
        expect(user.role).toBe('CUSTOMER');
      });
    });

    it('should create new admin user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: `admin-${Date.now()}@kolaqbitters.com`,
          password: 'AdminPass123!',
          name: 'New Admin',
          role: 'ADMIN',
        })
        .expect(201);

      expect(response.body.role).toBe('ADMIN');
      expect(response.body).toHaveProperty('id');
    });

    it('should update user status', async () => {
      const usersResponse = await request(app.getHttpServer())
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      const customerId = usersResponse.body.find((u: any) => u.role === 'CUSTOMER')?.id;

      if (customerId) {
        const response = await request(app.getHttpServer())
          .patch(`/api/v1/admin/users/${customerId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            status: 'SUSPENDED',
          })
          .expect(200);

        expect(response.body.status).toBe('SUSPENDED');
      }
    });
  });

  describe('Activity Logs', () => {
    it('should get activity logs', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter activity by action type', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/activity?action=CREATE')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter activity by entity type', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/activity?entityType=PRODUCT')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Notifications Management', () => {
    it('should get notifications', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should send broadcast notification', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/notifications/broadcast')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test Broadcast',
          message: 'This is a test broadcast message',
          type: 'ANNOUNCEMENT',
          channels: ['email'],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe('ANNOUNCEMENT');
    });
  });

  describe('Reports', () => {
    it('should get sales report', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/reports/sales')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
        })
        .expect(200);

      expect(response.body).toHaveProperty('totalSales');
      expect(response.body).toHaveProperty('orderCount');
    });

    it('should get inventory report', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/reports/inventory')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalProducts');
      expect(response.body).toHaveProperty('totalStock');
    });

    it('should get customer report', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/reports/customers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalCustomers');
      expect(response.body).toHaveProperty('newCustomers');
    });
  });
});
