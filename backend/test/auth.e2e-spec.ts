import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    prisma = app.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Admin Login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send({
          email: 'admin@kolaqbitters.com',
          password: 'Kolaqbitters$',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('admin@kolaqbitters.com');
      expect(response.body.user.role).toBe('ADMIN');
    });

    it('should fail with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send({
          email: 'admin@kolaqbitters.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should fail with missing fields', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send({
          email: 'admin@kolaqbitters.com',
        })
        .expect(400);
    });

    it('should fail with invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });
  });

  describe('Customer Registration', () => {
    const testEmail = `test-${Date.now()}@example.com`;

    it('should register a new customer', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: testEmail,
          password: 'Password123!',
          name: 'Test User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.user.role).toBe('CUSTOMER');
    });

    it('should login with newly created customer', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testEmail,
          password: 'Password123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe(testEmail);
    });

    it('should fail to register with existing email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: testEmail,
          password: 'Password123!',
          name: 'Duplicate User',
        })
        .expect(409);
    });
  });

  describe('Protected Routes', () => {
    let adminToken: string;
    let customerToken: string;

    beforeAll(async () => {
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

    it('should access admin route with admin token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should deny admin route access with customer token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);
    });

    it('should deny access without token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard/stats')
        .expect(401);
    });

    it('should deny access with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
