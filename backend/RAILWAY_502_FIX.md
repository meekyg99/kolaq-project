# Railway 502 Error - Troubleshooting Guide

## Problem
The backend application starts successfully (confirmed in logs) but returns **502 Bad Gateway** when accessed via the public URL `kolaq-project-production.up.railway.app`.

## Evidence
```
✅ Logs show: "Nest application successfully started"
✅ Logs show: "Backend running on http://0.0.0.0:4000"  
✅ Railway health check returns 200 OK
❌ Public URL requests return 502 Bad Gateway
```

## Possible Causes & Solutions

### 1. Port Configuration Mismatch

**Issue**: App is hardcoded to port 4000, but Railway might assign a different PORT.

**Solution A**: Let Railway auto-assign PORT
```bash
# In Railway dashboard:
# 1. Go to project settings
# 2. Find PORT variable
# 3. Delete it (Railway will auto-assign)
# 4. Redeploy
```

**Solution B**: Verify PORT is correctly read
```typescript
// In src/main.ts - Already correct:
const port = process.env.PORT || 4000;
await app.listen(port, '0.0.0.0');
```

**Test**: Check Railway variables
```bash
railway variables | grep PORT
# Should show: PORT=<dynamically assigned>
```

### 2. Health Check Path Mismatch

**Issue**: Railway might be checking wrong health endpoint.

**Current Config** (railway.toml):
```toml
healthcheckPath = "/api/v1/monitoring/health"
healthcheckTimeout = 100
```

**Solution**: Verify in Railway dashboard:
1. Go to Settings → Deploy
2. Check "Health Check Path" is `/api/v1/monitoring/health`
3. Check "Health Check Timeout" is appropriate (100 seconds is very high)

**Recommendation**: Reduce timeout to 30 seconds

### 3. Redis Connection Blocking

**Issue**: BullMQ/Redis connection might be blocking the app startup.

**Check**: Look for Redis errors in logs
```bash
railway logs --lines 200 | grep -i redis
```

**Solution**: Make Redis connection non-blocking
```typescript
// In app.module.ts BullModule config:
BullModule.forRootAsync({
  useFactory: async () => ({
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: 3,
      enableReadyCheck: false, // Don't block on connection
      lazyConnect: true, // Connect asynchronously
    },
  }),
}),
```

### 4. Missing Start Command

**Issue**: Railway can't find the start script.

**Check**: Verify package.json has start script
```json
{
  "scripts": {
    "start": "node dist/src/main",
    "start:prod": "node dist/src/main"
  }
}
```

**Check**: Verify build output exists
```bash
railway run ls -la dist/src/
# Should show main.js
```

### 5. Database Migration Failing

**Issue**: Migrations run during build but fail silently.

**Current**: In railway.toml
```toml
startCommand = "npm run postbuild && npm start"
```

**Solution**: Split migration from start
```toml
[deploy]
startCommand = "npm start"
# Run migrations separately in Railway dashboard
```

Or use this Procfile:
```
web: npm run db:migrate:deploy && npm start
release: npm run db:migrate:deploy
```

### 6. CORS or Proxy Issue

**Issue**: Railway proxy can't forward requests correctly.

**Check**: Current CORS config (src/main.ts):
```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://kolaq-project-production.up.railway.app',
    /\.netlify\.app$/,
    /\.vercel\.app$/,
  ],
  credentials: true,
});
```

**Solution**: Temporarily allow all origins for debugging
```typescript
app.enableCors({
  origin: true, // Allow all for testing
  credentials: true,
});
```

## Step-by-Step Debugging

### Step 1: Check Railway Service Settings
```bash
railway status
railway variables
```

Expected output:
- Service: kolaq-project
- Status: Running
- PORT: Should be auto-assigned or match app config

### Step 2: Check Recent Logs
```bash
railway logs --lines 100
```

Look for:
- ✅ "Nest application successfully started"
- ✅ "Backend running on..."
- ❌ Any error messages
- ❌ Connection failures
- ❌ Unhandled exceptions

### Step 3: Test Health Check Internally
Railway's internal health check works (200 OK), so the app IS running.

### Step 4: Check Railway Dashboard
1. Go to https://railway.app
2. Find your project "remarkable-sparkle"
3. Click on "kolaq-project" service
4. Check "Settings" → "Networking"
5. Verify:
   - Public networking is enabled
   - Domain is correct: kolaq-project-production.up.railway.app
   - No TCP proxy issues

### Step 5: Try Alternative Domain
Railway provides a Railway-generated domain. Try that instead:
```bash
# Check for alternative domain
railway domain
```

### Step 6: Check for Build Errors
```bash
# Check build logs
railway logs --build
```

## Quick Fixes to Try

### Fix 1: Remove PORT Variable
```bash
# Let Railway auto-assign PORT
# Go to Railway dashboard → Variables → Delete PORT variable
# Then redeploy:
railway up --detach
```

### Fix 2: Simplify Health Check
```typescript
// Add a simple root endpoint in main.ts
app.get('/', (req, res) => {
  res.send('Kolaq Backend API - Running');
});
```

Then update railway.toml:
```toml
healthcheckPath = "/"
healthcheckTimeout = 30
```

### Fix 3: Add Debug Logging
```typescript
// In main.ts, add more logging:
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  
  // ... existing setup ...
  
  const port = process.env.PORT || 4000;
  console.log('🔍 PORT from env:', process.env.PORT);
  console.log('🔍 Using port:', port);
  console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
  
  await app.listen(port, '0.0.0.0');
  
  console.log('✅ Server listening on:', port);
  console.log('✅ Accessible at: http://0.0.0.0:' + port);
}
```

### Fix 4: Test with Nixpacks Config
Update nixpacks.toml:
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci --legacy-peer-deps"]

[phases.build]
cmds = [
  "npm run build",
  "npx prisma generate"
]

[start]
cmd = "node dist/src/main"
```

## Alternative: Deploy to Render

If Railway continues to have issues, try Render:

1. Create render.yaml:
```yaml
services:
  - type: web
    name: kolaq-backend
    env: node
    buildCommand: npm install && npm run build && npx prisma migrate deploy
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: RESEND_API_KEY
        sync: false
      - key: NODE_ENV
        value: production
```

2. Connect to Render dashboard
3. Deploy from GitHub

## Still Not Working?

### Contact Railway Support
If none of the above works, this might be a Railway platform issue.

1. Check Railway status: https://status.railway.app
2. Contact support: https://help.railway.app
3. Or ask in Railway Discord: https://discord.gg/railway

### Check Railway Limits
- Free tier has limitations
- Check if you've hit any limits (builds, bandwidth, etc.)

## Expected Resolution

Once fixed, you should see:
```bash
curl https://kolaq-project-production.up.railway.app/
# Response: "Kolaq Backend API - Running"

curl https://kolaq-project-production.up.railway.app/api/v1/monitoring/health
# Response: {"status":"healthy","timestamp":"..."}

curl https://kolaq-project-production.up.railway.app/api/v1/products
# Response: [array of products]
```

## Temporary Workaround

While debugging Railway, you can:
1. **Test locally** - All features work locally
2. **Deploy to Vercel** - Use as temporary production
3. **Deploy to Fly.io** - Alternative platform
4. **Use ngrok** - Expose local server for frontend testing

Example ngrok:
```bash
# Install ngrok
npm install -g ngrok

# Run backend locally
npm run start:dev

# In another terminal, expose it
ngrok http 4000

# Use ngrok URL for frontend testing
```

---

**Priority**: CRITICAL  
**Blocking**: Production deployment, security testing, load testing  
**Estimated Fix Time**: 1-2 hours if Railway configuration issue, 4-6 hours if platform issue
