# E2E Testing Guide

## Overview
This project includes comprehensive end-to-end (E2E) tests covering all major features of the KOLAQ backend API.

## Test Suites

### 1. Authentication Tests (`auth.e2e-spec.ts`)
- Admin login with valid/invalid credentials
- Customer registration and login
- Protected route access control
- JWT token validation
- Role-based authorization

### 2. Catalog Tests (`catalog.e2e-spec.ts`)
- Public product browsing
- Product search and filtering
- Product CRUD operations (admin)
- Inventory management
- Product variants
- Category management

### 3. Cart & Checkout Tests (`cart-checkout.e2e-spec.ts`)
- Cart creation and management
- Adding/updating/removing items
- Checkout session creation
- Payment method selection
- Payment processing flow

### 4. Order Tests (`orders.e2e-spec.ts`)
- Order creation and retrieval
- Order status tracking
- Order lifecycle (pending → processing → shipped → delivered)
- Order cancellation
- Admin order management
- Order statistics

### 5. Admin Dashboard Tests (`admin.e2e-spec.ts`)
- Dashboard statistics
- Sales analytics
- Inventory alerts
- User management
- Activity logging
- Notification broadcasting
- Report generation

## Running Tests

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Specific Test Suite
```bash
npm run test:e2e -- auth.e2e-spec.ts
npm run test:e2e -- catalog.e2e-spec.ts
npm run test:e2e -- cart-checkout.e2e-spec.ts
npm run test:e2e -- orders.e2e-spec.ts
npm run test:e2e -- admin.e2e-spec.ts
```

### Run With Coverage
```bash
npm run test:e2e:cov
```

### Run in Watch Mode (for development)
```bash
npm run test:e2e:watch
```

### Run Custom Test Runner
```bash
npm run test:e2e:all
```

## Test Environment Setup

### Prerequisites
1. PostgreSQL database (Railway or local)
2. Environment variables configured
3. Database migrated and seeded

### Environment Variables
Create `.env.test` file with test-specific configuration:
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_key
```

### Database Setup for Tests
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed test data
npm run db:seed
```

## Test Structure

Each test suite follows this pattern:

```typescript
describe('Feature (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    // Setup test module
    // Initialize app
    // Get auth tokens
  });

  afterAll(async () => {
    // Cleanup
    // Close connections
  });

  describe('Specific Feature', () => {
    it('should do something', async () => {
      // Test implementation
    });
  });
});
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use unique identifiers (timestamps) for test data
- Clean up test data after tests

### 2. Authentication
- Obtain fresh tokens for each test suite
- Test both authenticated and unauthenticated access
- Verify role-based permissions

### 3. Data Setup
- Create minimal required data
- Use factories or helpers for complex objects
- Avoid hardcoded IDs

### 4. Assertions
- Test both success and failure cases
- Verify response structure
- Check status codes
- Validate error messages

### 5. Performance
- Use `runInBand` to avoid conflicts
- Set appropriate timeouts
- Mock external services when possible

## Common Test Patterns

### Testing Protected Routes
```typescript
it('should deny access without token', async () => {
  await request(app.getHttpServer())
    .get('/api/v1/protected-route')
    .expect(401);
});

it('should allow access with valid token', async () => {
  await request(app.getHttpServer())
    .get('/api/v1/protected-route')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
});
```

### Testing CRUD Operations
```typescript
describe('Product CRUD', () => {
  let productId: string;

  it('should create product', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Product' })
      .expect(201);
    
    productId = response.body.id;
  });

  it('should get product', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/products/${productId}`)
      .expect(200);
  });

  it('should update product', async () => {
    await request(app.getHttpServer())
      .patch(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Name' })
      .expect(200);
  });

  it('should delete product', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
```

### Testing Complex Flows
```typescript
describe('Checkout Flow', () => {
  it('should complete full checkout', async () => {
    // 1. Add to cart
    await request(app.getHttpServer())
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    // 2. Create checkout session
    const checkout = await request(app.getHttpServer())
      .post('/api/v1/checkout/session')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: {...} });

    // 3. Process payment
    await request(app.getHttpServer())
      .post('/api/v1/checkout/process')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderId: checkout.body.order.id });

    // 4. Verify order created
    const order = await request(app.getHttpServer())
      .get(`/api/v1/orders/${checkout.body.order.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(order.body.status).toBe('PENDING');
  });
});
```

## Debugging Tests

### Enable Verbose Logging
```bash
npm run test:e2e -- --verbose
```

### Run Single Test
```bash
npm run test:e2e -- -t "should login successfully"
```

### Debug in VSCode
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest E2E",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": [
    "--config",
    "./test/jest-e2e.json",
    "--runInBand",
    "--no-cache"
  ],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run db:migrate
      - run: npm run test:e2e
```

## Troubleshooting

### Database Connection Errors
- Verify DATABASE_URL is correct
- Check database is running and accessible
- Ensure migrations are up to date

### Timeout Errors
- Increase Jest timeout in jest-e2e.json
- Use `--maxWorkers=1` to run tests sequentially
- Check for hanging promises

### Test Flakiness
- Add proper waits/delays where needed
- Use unique test data identifiers
- Ensure proper cleanup between tests

### Authentication Failures
- Verify admin user is seeded
- Check JWT_SECRET matches
- Ensure token format is correct

## Next Steps

1. Add integration tests for webhooks
2. Add performance tests
3. Add load tests
4. Set up test coverage reporting
5. Integrate with CI/CD pipeline

## Resources

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
