import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Catalog (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Public Catalog Access', () => {
    it('should get all products without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/catalog/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter products by category', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/catalog/products?category=bitters')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should search products', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/catalog/products?search=bitter')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get product by id', async () => {
      const productsResponse = await request(app.getHttpServer())
        .get('/api/v1/catalog/products');

      if (productsResponse.body.length > 0) {
        const productId = productsResponse.body[0].id;
        const response = await request(app.getHttpServer())
          .get(`/api/v1/catalog/products/${productId}`)
          .expect(200);

        expect(response.body).toHaveProperty('id', productId);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('prices');
      }
    });
  });

  describe('Admin Product Management', () => {
    it('should create a new product', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/catalog/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Test Product ${Date.now()}`,
          description: 'A test product for e2e testing',
          category: 'bitters',
          prices: [
            { currency: 'NGN', amount: 5000 },
            { currency: 'USD', amount: 12 },
          ],
          stock: 100,
          images: ['https://example.com/image1.jpg'],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body.prices).toHaveLength(2);
      productId = response.body.id;
    });

    it('should update a product', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/catalog/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Test Product',
          description: 'Updated description',
        })
        .expect(200);

      expect(response.body.name).toBe('Updated Test Product');
      expect(response.body.description).toBe('Updated description');
    });

    it('should update product inventory', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/catalog/products/${productId}/inventory`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          stock: 150,
          reason: 'Stock replenishment',
        })
        .expect(200);

      expect(response.body.stock).toBe(150);
    });

    it('should fail to create product without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/catalog/products')
        .send({
          name: 'Unauthorized Product',
          category: 'bitters',
          prices: [{ currency: 'NGN', amount: 5000 }],
        })
        .expect(401);
    });

    it('should delete a product', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/catalog/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Verify product is deleted
      await request(app.getHttpServer())
        .get(`/api/v1/catalog/products/${productId}`)
        .expect(404);
    });
  });

  describe('Product Variants', () => {
    let variantProductId: string;

    it('should create product with variants', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/catalog/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `Variant Product ${Date.now()}`,
          description: 'Product with variants',
          category: 'bitters',
          prices: [{ currency: 'NGN', amount: 5000 }],
          stock: 100,
          variants: [
            {
              name: '200ml Bottle',
              prices: [{ currency: 'NGN', amount: 5000 }],
              stock: 50,
              images: ['https://example.com/200ml.jpg'],
            },
            {
              name: '500ml Bottle',
              prices: [{ currency: 'NGN', amount: 12000 }],
              stock: 30,
              images: ['https://example.com/500ml.jpg'],
            },
          ],
        })
        .expect(201);

      expect(response.body.variants).toHaveLength(2);
      variantProductId = response.body.id;
    });

    it('should get product with variants', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/catalog/products/${variantProductId}`)
        .expect(200);

      expect(response.body.variants).toBeDefined();
      expect(response.body.variants.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Categories', () => {
    it('should get all categories', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/catalog/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
