# Observability Setup ✅

## Overview
Comprehensive observability has been implemented with structured logging, error tracking, and health monitoring.

## Features Implemented

### 1. Structured Logging (Pino) 🔍
- **Library**: `nestjs-pino`, `pino-pretty`
- **Features**:
  - Request/response logging with auto-generated request IDs
  - User context tracking (userId, email)
  - Sensitive data redaction (passwords, tokens, auth headers)
  - Pretty formatted logs in development
  - JSON logs in production
  - Performance metrics

**Configuration**: `src/config/logger.config.ts`

### 2. Error Tracking (Sentry) 🐛
- **Library**: `@sentry/node`, `@sentry/nestjs`
- **Features**:
  - Automatic exception capture for 5xx errors
  - User context and request details
  - Prisma query integration
  - HTTP request tracing
  - Sensitive data filtering

**Configuration**: `src/config/sentry.config.ts`

### 3. Health Monitoring 🏥
- **Endpoints**:
  - `GET /api/v1/monitoring/health` - Database connectivity check
  - `GET /api/v1/monitoring/metrics` - Application metrics
  - `GET /api/v1/monitoring/status` - System status

**Features**:
- Database connection status
- Memory usage (RSS, Heap)
- CPU usage
- Database record counts
- System information (CPU, memory, OS)
- Process uptime

**Module**: `src/modules/monitoring/`

### 4. Global Exception Filter 🛡️
- Catches all unhandled exceptions
- Logs with full context
- Reports to Sentry (5xx errors)
- Returns standardized error responses

**Filter**: `src/common/filters/http-exception.filter.ts`

## Environment Variables

```env
# Optional - Sentry DSN for error tracking
SENTRY_DSN=""

# Log level: debug, info, warn, error
LOG_LEVEL="info"
```

## How It Works

### Request Lifecycle
1. **Request arrives** → Pino logs request details
2. **Processing** → Application logic executes
3. **Error occurs** → Exception filter catches it
   - Logs with full context
   - Reports to Sentry (if 5xx)
   - Returns user-friendly error
4. **Response sent** → Pino logs response status

### Log Format (Development)
```
[2025-11-16 16:05:00] INFO POST /api/v1/auth/login - Request received
[2025-11-16 16:05:00] INFO POST /api/v1/auth/login - Response 200
```

### Log Format (Production)
```json
{
  "level": "info",
  "time": 1700150700000,
  "req": {
    "method": "POST",
    "url": "/api/v1/auth/login",
    "id": "req-123"
  },
  "userId": "user-456",
  "res": {
    "statusCode": 200
  }
}
```

## Health Check Response

### GET /api/v1/monitoring/health
```json
{
  "status": "ok",
  "timestamp": "2025-11-16T16:05:00.000Z",
  "uptime": 123.45,
  "database": "connected"
}
```

## Metrics Response

### GET /api/v1/monitoring/metrics
```json
{
  "timestamp": "2025-11-16T16:05:00.000Z",
  "process": {
    "uptime": 123.45,
    "pid": 12345,
    "memory": {
      "rss": "150MB",
      "heapTotal": "80MB",
      "heapUsed": "45MB",
      "external": "5MB"
    },
    "cpu": {
      "user": "1200ms",
      "system": "300ms"
    }
  },
  "database": {
    "products": 50,
    "orders": 125,
    "adminUsers": 1,
    "carts": 23
  }
}
```

## System Status Response

### GET /api/v1/monitoring/status
```json
{
  "timestamp": "2025-11-16T16:05:00.000Z",
  "system": {
    "platform": "win32",
    "arch": "x64",
    "nodeVersion": "v20.0.0",
    "uptime": 12345,
    "loadAverage": ["0.50", "0.45", "0.40"],
    "memory": {
      "total": "16GB",
      "free": "8GB",
      "used": "8GB",
      "usagePercent": "50%"
    },
    "cpu": {
      "count": 8,
      "model": "Intel Core i7"
    }
  },
  "application": {
    "status": "ok",
    "database": "connected"
  }
}
```

## Sentry Integration (Optional)

### Setup Sentry
1. Create account at https://sentry.io
2. Create new project (Node.js/Express)
3. Copy DSN
4. Add to environment:
   ```env
   SENTRY_DSN="https://xxxxx@o123456.ingest.sentry.io/7890123"
   ```

### What Gets Reported
- All 500+ errors
- Exception details and stack traces
- Request context (method, URL, user)
- Environment info
- Custom tags and context

### What's Filtered
- Authorization headers
- Cookies
- Passwords and tokens
- Sensitive request data

## Monitoring Best Practices

### 1. Use Health Checks
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor `/api/v1/monitoring/health` endpoint
- Alert on database disconnections

### 2. Track Metrics
- Monitor memory usage trends
- Watch for memory leaks
- Track database growth
- Monitor response times

### 3. Review Logs
- Check error logs daily
- Look for patterns in warnings
- Review Sentry error reports
- Investigate 5xx errors immediately

### 4. Set Up Alerts
- High error rate (> 5%)
- Database connection failures
- High memory usage (> 80%)
- Slow response times (> 2s)

## Production Deployment

### Railway/Render
Add environment variable:
```bash
SENTRY_DSN="your-sentry-dsn-here"
```

### Docker
Logs will be output to stdout/stderr and captured by container runtime.

### Log Aggregation
Consider using:
- **Datadog** - Full observability platform
- **LogDNA/LogRocket** - Log management
- **New Relic** - APM and monitoring
- **Better Stack** - Logs and uptime

## Troubleshooting

### High Memory Usage
Check `/api/v1/monitoring/metrics` for:
- Growing heap size
- Increasing database connections
- Cart/session buildup

### Database Errors
Check `/api/v1/monitoring/health` for:
- Connection status
- Query timeouts
- Migration issues

### Performance Issues
Review logs for:
- Slow queries
- High request volumes
- Memory pressure
- CPU bottlenecks

## Testing Observability

### 1. Test Health Check
```bash
curl http://localhost:4000/api/v1/monitoring/health
```

### 2. Test Metrics
```bash
curl http://localhost:4000/api/v1/monitoring/metrics
```

### 3. Test Error Tracking
Trigger an error and check:
- Logs in console (development)
- Sentry dashboard (if configured)

### 4. Load Testing
```bash
# Install autocannon
npm install -g autocannon

# Run load test
autocannon -c 10 -d 30 http://localhost:4000/api/v1/monitoring/health
```

## What's Next?

### Optional Enhancements
- [ ] Add OpenTelemetry for distributed tracing
- [ ] Implement custom metrics (Prometheus)
- [ ] Add performance monitoring (APM)
- [ ] Set up log aggregation service
- [ ] Create alerting rules
- [ ] Add business metrics tracking

## Summary

✅ **Pino Logging** - Structured logs with context  
✅ **Sentry Integration** - Error tracking and reporting  
✅ **Health Endpoints** - Monitor app and database  
✅ **Metrics Collection** - Performance and usage data  
✅ **Exception Handling** - Global error management  
✅ **Sensitive Data Protection** - Automatic redaction  

Your backend now has production-grade observability! 🎉
