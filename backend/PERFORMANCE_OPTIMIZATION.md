# Performance Optimization Guide

## Overview
This document outlines performance optimization strategies for the Kolaq Bitters backend API.

## Current Performance Baseline

### Response Time Targets
- **Public Endpoints**: < 300ms (p95)
- **Admin Endpoints**: < 500ms (p95)
- **Dashboard Analytics**: < 1000ms (p95)
- **Search Queries**: < 200ms (p95)

## Optimization Areas

### 1. Database Optimization

#### A. Query Optimization
```typescript
// ❌ Bad: N+1 Query Problem
const products = await prisma.product.findMany();
for (const product of products) {
  const prices = await prisma.price.findMany({ where: { productId: product.id } });
}

// ✅ Good: Use include or nested queries
const products = await prisma.product.findMany({
  include: {
    prices: true,
    variants: { include: { prices: true } }
  }
});
```

#### B. Indexing Strategy
Add indexes to frequently queried fields:

```sql
-- Products
CREATE INDEX idx_products_category ON "Product"(category);
CREATE INDEX idx_products_status ON "Product"(status);
CREATE INDEX idx_products_slug ON "Product"(slug);
CREATE INDEX idx_products_featured ON "Product"(featured);

-- Prices
CREATE INDEX idx_prices_currency ON "Price"(currency);
CREATE INDEX idx_prices_variant ON "Price"("variantId");

-- Orders
CREATE INDEX idx_orders_status ON "Order"(status);
CREATE INDEX idx_orders_customer ON "Order"("customerEmail");
CREATE INDEX idx_orders_date ON "Order"("createdAt");

-- Inventory
CREATE INDEX idx_inventory_variant ON "Inventory"("variantId");
CREATE INDEX idx_inventory_low_stock ON "Inventory"("quantity") WHERE quantity < reorderPoint;
```

#### C. Connection Pooling
Update DATABASE_URL to use connection pooling:
```
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=20&pool_timeout=30"
```

#### D. Query Result Caching
```typescript
// Use Prisma Accelerate for query caching
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

// Cache catalog queries for 5 minutes
const products = await prisma.product.findMany({
  cacheStrategy: { ttl: 300, swr: 60 }
});
```

### 2. Redis Caching Strategy

#### A. Catalog Caching
```typescript
// Cache product catalog
const CACHE_TTL = {
  PRODUCTS: 300,      // 5 minutes
  FEATURED: 600,      // 10 minutes
  CATEGORIES: 3600,   // 1 hour
  SINGLE_PRODUCT: 300 // 5 minutes
};

async function getProducts() {
  const cacheKey = 'catalog:products:all';
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const products = await prisma.product.findMany({
    include: { variants: { include: { prices: true } } }
  });
  
  await redis.setex(cacheKey, CACHE_TTL.PRODUCTS, JSON.stringify(products));
  return products;
}
```

#### B. Dashboard Analytics Caching
```typescript
// Cache expensive analytics queries
async function getSalesAnalytics(startDate, endDate) {
  const cacheKey = `analytics:sales:${startDate}:${endDate}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const analytics = await calculateSalesAnalytics(startDate, endDate);
  await redis.setex(cacheKey, 1800, JSON.stringify(analytics)); // 30 minutes
  return analytics;
}
```

#### C. Session/Cart Caching
Already implemented via Redis for cart sessions.

### 3. API Response Optimization

#### A. Pagination
Implement cursor-based pagination for large datasets:
```typescript
// ✅ Good: Cursor-based pagination
async findAll(cursor?: string, limit = 20) {
  return await prisma.product.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' }
  });
}
```

#### B. Field Selection
Only return needed fields:
```typescript
// ✅ Good: Select specific fields
const products = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    slug: true,
    mainImage: true,
    variants: {
      select: {
        id: true,
        size: true,
        prices: {
          select: { amount: true, currency: true }
        }
      }
    }
  }
});
```

#### C. Response Compression
Already configured in NestJS (enable in production):
```typescript
// main.ts
app.use(compression());
```

### 4. Background Job Optimization

#### A. Email Queue Processing
```typescript
// Optimize email sending with batching
async function processBatchEmails() {
  const queue = await emailQueue.getJobs(['waiting'], 0, 100);
  
  // Process in batches of 10
  const batches = chunk(queue, 10);
  for (const batch of batches) {
    await Promise.all(batch.map(job => job.process()));
  }
}
```

#### B. Inventory Reconciliation
Run during off-peak hours:
```typescript
// Schedule for 3 AM daily
cron.schedule('0 3 * * *', async () => {
  await inventoryReconciliationQueue.add('reconcile', {});
});
```

### 5. Rate Limiting Optimization

Current implementation is good, but consider:
```typescript
// Use Redis for distributed rate limiting
@UseGuards(ThrottlerGuard)
@Throttle(100, 60) // 100 requests per minute
```

### 6. CDN & Static Asset Optimization

#### A. Image Optimization
- Use WebP format for product images
- Implement image resizing on upload
- Serve via CDN (Cloudflare, AWS CloudFront)

#### B. API Response Caching
Configure cache headers:
```typescript
@Header('Cache-Control', 'public, max-age=300')
async getProducts() {
  // ...
}
```

### 7. Monitoring & Profiling

#### A. Prisma Query Logging
Enable in development:
```typescript
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});
```

#### B. APM Integration
Use OpenTelemetry for distributed tracing:
```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  instrumentations: [
    new HttpInstrumentation(),
    new PrismaInstrumentation(),
  ],
});

sdk.start();
```

#### C. Performance Metrics
Track key metrics:
- Response times (p50, p95, p99)
- Database query times
- Cache hit rates
- Error rates
- Concurrent connections

### 8. Load Testing

#### A. Artillery Configuration
Create `artillery.yml`:
```yaml
config:
  target: "https://kolaq-project-production.up.railway.app"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  
scenarios:
  - name: "Browse and add to cart"
    flow:
      - get:
          url: "/api/v1/products"
      - get:
          url: "/api/v1/products/featured"
      - post:
          url: "/api/v1/auth/login"
          json:
            email: "admin@kolaqbitters.com"
            password: "Kolaqbitters$"
          capture:
            - json: "$.accessToken"
              as: "token"
      - get:
          url: "/api/v1/cart"
          headers:
            Authorization: "Bearer {{ token }}"
```

Run with:
```bash
artillery run artillery.yml
```

### 9. Database Connection Optimization

#### A. PgBouncer
Use connection pooler for Postgres:
```
DATABASE_URL="postgresql://user:password@pgbouncer-host:6432/db?pgbouncer=true"
```

#### B. Read Replicas
For high-traffic scenarios, use read replicas:
```typescript
const prismaRead = new PrismaClient({
  datasources: { db: { url: READ_REPLICA_URL } }
});

const prismaWrite = new PrismaClient({
  datasources: { db: { url: WRITE_DATABASE_URL } }
});
```

### 10. Code-Level Optimizations

#### A. Async/Await Best Practices
```typescript
// ❌ Bad: Sequential execution
const user = await getUser();
const orders = await getOrders();
const products = await getProducts();

// ✅ Good: Parallel execution
const [user, orders, products] = await Promise.all([
  getUser(),
  getOrders(),
  getProducts()
]);
```

#### B. Lazy Loading
```typescript
// Load heavy data only when needed
class ProductService {
  async getProduct(id: string, includeReviews = false) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        variants: { include: { prices: true } },
        ...(includeReviews && { reviews: true })
      }
    });
  }
}
```

#### C. Memoization
```typescript
import memoize from 'memoizee';

const getCategories = memoize(
  async () => {
    return await prisma.category.findMany();
  },
  { promise: true, maxAge: 300000 } // Cache for 5 minutes
);
```

## Implementation Priority

### Phase 1: Quick Wins (Week 1)
1. ✅ Enable response compression
2. ✅ Add database indexes
3. ✅ Implement catalog caching in Redis
4. [ ] Enable Prisma query logging in dev
5. [ ] Add pagination to all list endpoints

### Phase 2: Medium Impact (Week 2)
1. [ ] Optimize N+1 queries
2. [ ] Implement dashboard analytics caching
3. [ ] Add field selection to queries
4. [ ] Configure CDN for images
5. [ ] Set up load testing

### Phase 3: Advanced (Week 3-4)
1. [ ] Implement Prisma Accelerate
2. [ ] Set up APM/distributed tracing
3. [ ] Configure read replicas (if needed)
4. [ ] Implement materialized views for analytics
5. [ ] Advanced caching strategies

## Testing Performance

### 1. Run Performance Tests
```bash
cd backend
node optimize-performance.js
```

### 2. Monitor Logs
```bash
# Railway logs
railway logs --tail

# Local logs
npm run start:dev
```

### 3. Database Query Analysis
```bash
# Enable slow query log in PostgreSQL
ALTER DATABASE postgres SET log_min_duration_statement = 1000; -- Log queries > 1s

# View slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
```

### 4. Memory Profiling
```bash
# Use Node.js built-in profiler
node --prof dist/src/main.js

# Analyze profile
node --prof-process isolate-*.log > profile.txt
```

## Success Criteria

- [ ] All public endpoints respond < 300ms (p95)
- [ ] Dashboard loads < 1s
- [ ] Search results < 200ms
- [ ] 100 concurrent users without degradation
- [ ] Cache hit rate > 70% for catalog
- [ ] Database queries < 50ms (p95)
- [ ] No N+1 query patterns
- [ ] Memory usage stable under load

## Monitoring Checklist

- [ ] Set up performance dashboards
- [ ] Configure alerts for slow queries
- [ ] Monitor cache hit rates
- [ ] Track error rates
- [ ] Set up uptime monitoring
- [ ] Monitor database connection pool
- [ ] Track API response times

## Resources

- [Prisma Performance Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [NestJS Performance Tips](https://docs.nestjs.com/techniques/performance)
- [Redis Caching Strategies](https://redis.io/docs/manual/patterns/)
- [PostgreSQL Indexing](https://www.postgresql.org/docs/current/indexes.html)

---

**Last Updated**: 2025-11-16  
**Status**: In Progress  
**Next Action**: Run performance tests and implement Phase 1 optimizations
