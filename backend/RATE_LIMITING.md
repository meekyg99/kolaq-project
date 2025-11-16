# Rate Limiting Implementation

## Overview
Rate limiting has been implemented using `@nestjs/throttler` to protect the API from abuse and ensure fair usage.

## Configuration

### Global Rate Limits
The following rate limits are applied globally to all endpoints:

1. **Short-term**: 10 requests per second
2. **Medium-term**: 50 requests per 10 seconds  
3. **Long-term**: 100 requests per minute

The most restrictive limit that applies will be enforced.

## How It Works

### Automatic Protection
All endpoints are automatically protected by the rate limiter. When a client exceeds the limit:
- HTTP Status: `429 Too Many Requests`
- Response headers include:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining in current window
  - `X-RateLimit-Reset`: Time when the limit resets

### Skipping Rate Limiting
If certain endpoints need to bypass rate limiting (e.g., health checks), use the `@SkipThrottle()` decorator:

```typescript
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Get('health')
healthCheck() {
  return { status: 'ok' };
}
```

### Custom Rate Limits for Specific Endpoints
To apply custom rate limits to specific endpoints:

```typescript
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
@Post('expensive-operation')
expensiveOperation() {
  // ...
}
```

## Client-Side Handling

Clients should:
1. Monitor response headers for rate limit information
2. Implement exponential backoff when receiving 429 errors
3. Cache responses when possible to reduce API calls

## Rate Limit Strategy

The current limits are designed for:
- **Public endpoints**: Generous limits for browsing catalog
- **Authentication endpoints**: Stricter limits to prevent brute force
- **Order creation**: Moderate limits to prevent abuse
- **Admin endpoints**: Protected by authentication + rate limits

## Monitoring

Rate limit violations are logged and can be monitored for:
- Identifying abusive clients
- Adjusting limits based on usage patterns
- Detecting DDoS attempts

## Future Enhancements

Potential improvements:
1. **User-based rate limiting**: Different limits for authenticated vs anonymous users
2. **Redis storage**: For distributed rate limiting across multiple servers
3. **Custom rate limits per endpoint**: Fine-tuned limits based on resource intensity
4. **Premium tier limits**: Higher limits for paid customers
