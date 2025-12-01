# Render Deployment Checklist
**Date**: December 1, 2025
**Purpose**: Deploy backend to Render as alternative/backup to Railway

---

## 📋 Pre-Deployment Checklist

- [x] ✅ Code pushed to GitHub (main branch)
- [x] ✅ Railway environment variables documented
- [x] ✅ Render deployment guide created
- [ ] Create Render account / Login
- [ ] Deploy to Render
- [ ] Configure environment variables
- [ ] Test deployment

---

## 🔑 Environment Variables for Render

Copy these **EXACT** values to Render dashboard:

### Required Variables

```env
NODE_ENV=production
PORT=4000
```

### Database (Use Railway PostgreSQL - IMPORTANT!)
```env
DATABASE_URL=postgresql://postgres:guHFyizHSkCzfckFfkTQlvQBsYObTQDQ@maglev.proxy.rlwy.net:47456/railway
```

### JWT Authentication
```env
JWT_SECRET=CLKjk1Cu7bMAxIYCgpq71gnzxF8zY+gCJIB/iJTuU6XaeV2h/C+vOplCsSR59SYzkOnAEzRXv5QDdfIsSNEEuQ==
JWT_EXPIRATION=3600m
```

### Redis (Railway Redis)
```env
REDIS_URL=redis://default:ZFGuwJTxvqFWhyGjZENxizYMLdrPWezf@redis.railway.internal:6379
```
**⚠️ Note**: `redis.railway.internal` only works from Railway. For Render, you may need to:
1. Use Railway's public Redis URL (get from Railway dashboard), OR
2. Create a separate Redis on Render

### Email Configuration
```env
RESEND_API_KEY=re_4zNADgLM_ELnnJnxDJQgzxJ39o85rrZLn
EMAIL_FROM=KOLAQ ALAGBO <noreply@kolaqalagbo.org>
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=support@kolaqalagbo.org
SMTP_PASS=Lallana99$
SMTP_FROM=KOLAQ ALAGBO noreply@kolaqalagbo.org
```

### Supabase (Optional - if used)
```env
SUPABASE_URL=https://obqhdvehujqbuklmrkob.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWhkdmVodWpxYnVrbG1ya29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTUxNzksImV4cCI6MjA3OTkzMTE3OX0.vtCtpNvRyXSy3acNekf0-7n9mORKq6Xk5AfTUA1ojeo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icWhkdmVodWpxYnVrbG1ya29iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM1NTE3OSwiZXhwIjoyMDc5OTMxMTc5fQ.GnmWDlccE0VQ4z3_14T-F-tMIss58f6xOl-GBnBjCH4
```

### WhatsApp (Optional)
```env
WHATSAPP_PHONE_NUMBER=+2348157065742
```

---

## 🚀 Step-by-Step Deployment to Render

### Step 1: Login to Render
1. Go to https://dashboard.render.com
2. Sign in with GitHub or email
3. If new account, verify email

### Step 2: Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Search for: `kolaq-project` or `meekyg99/kolaq-project`
5. Click **"Connect"**

### Step 3: Configure Build Settings

**Basic Configuration:**
- **Name**: `kolaq-backend-render`
- **Region**: Oregon (or closest to your users)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Build Settings:**
- **Build Command**: 
  ```bash
  npm install && npx prisma generate && npm run build
  ```
- **Start Command**: 
  ```bash
  node dist/src/main.js
  ```

**Instance Type:**
- Start with **Free** tier (512 MB RAM)
- Upgrade if needed later

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add each variable from the list above. **Copy-paste exactly!**

⚠️ **CRITICAL**: Make sure to use the Railway `DATABASE_URL` so both deployments share the same database!

### Step 5: Configure Health Check

Under **"Health & Alerts"**:
- **Health Check Path**: `/health`
- **Health Check Interval**: `30` seconds

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for build (5-10 minutes)
3. Watch the logs for any errors

---

## ✅ Post-Deployment Verification

### Step 1: Check Health Endpoint

Once deployed, Render will give you a URL like: `https://kolaq-backend-render.onrender.com`

Test the health endpoint:
```bash
curl https://kolaq-backend-render.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T21:17:00.000Z",
  "uptime": 123.45
}
```

### Step 2: Test Admin Login

```bash
curl -X POST https://kolaq-backend-render.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"support@kolaqalagbo.org","passcode":"Lallana99$"}'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "...",
    "email": "support@kolaqalagbo.org",
    "name": "Admin",
    "role": "admin"
  }
}
```

### Step 3: Test Product API

```bash
curl https://kolaq-backend-render.onrender.com/api/v1/products
```

Should return a list of products (or empty array if no products seeded).

---

## 🔧 Update Backend CORS

After successful deployment, update CORS in `backend/src/main.ts` to include Render URL:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://kolaqalagbo.org',
    'https://www.kolaqalagbo.org',
    'https://kolaqbitters.com',
    'https://www.kolaqbitters.com',
    'https://kolaq-project-production.up.railway.app',  // Railway
    'https://kolaq-backend-render.onrender.com',        // Add this for Render
    /\.netlify\.app$/,
    /\.vercel\.app$/,
  ],
  credentials: true,
});
```

Commit and push:
```bash
git add backend/src/main.ts
git commit -m "Add Render URL to CORS whitelist"
git push
```

Both Railway and Render will auto-deploy with the CORS update.

---

## ⚠️ Important Notes

### Database
- ✅ **DO USE** Railway's PostgreSQL database
- ❌ **DO NOT** create a separate database on Render
- This ensures data consistency between deployments

### Redis Issue
The Railway Redis URL (`redis.railway.internal`) won't work from Render because it's internal to Railway.

**Solutions:**
1. **Get Railway Public Redis URL** (if available)
2. **Create Redis on Render** (free tier available)
3. **Use Upstash Redis** (serverless, free tier)
4. **Disable Redis-dependent features** temporarily

### Free Tier Limitations
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down will be slow (30-60 seconds)
- Upgrade to paid tier ($7/month) for always-on service

---

## 🎯 Success Criteria

- [ ] Render deployment successful (no errors)
- [ ] Health endpoint returns 200 OK
- [ ] Admin login works
- [ ] Product API returns data
- [ ] Database queries work (same data as Railway)
- [ ] CORS updated for both Railway and Render
- [ ] Both deployments operational

---

## 🔄 Switching Between Deployments

### Use Railway (Primary)
Frontend env:
```env
NEXT_PUBLIC_API_URL=https://kolaq-project-production.up.railway.app
```

### Use Render (Alternative)
Frontend env:
```env
NEXT_PUBLIC_API_URL=https://kolaq-backend-render.onrender.com
```

### Load Balancing (Advanced)
You could use a load balancer or DNS failover to automatically switch between Railway and Render.

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify Node version compatibility
- Ensure all dependencies are in package.json

### Health Check Fails
- Verify `/health` endpoint exists
- Check if app is listening on correct PORT (4000)
- Review application logs

### Database Connection Error
- Verify DATABASE_URL is correct
- Check if Railway Postgres allows external connections
- Test connection string locally

### Redis Connection Error
- Use public Redis URL or create Render Redis
- Update REDIS_URL environment variable
- Restart Render service

---

## 📊 Monitoring Both Deployments

### Railway
- Dashboard: https://railway.app/project/167df734-2660-4fc1-8c05-7a317451a94d
- Logs: `railway logs`
- Status: `railway status`

### Render
- Dashboard: https://dashboard.render.com
- Logs: View in Render dashboard
- Metrics: Available in dashboard

---

## 💰 Cost Comparison

### Railway
- **Current**: Production environment
- **Cost**: ~$5-20/month (includes DB + Redis)
- **Free Tier**: $5 credit/month

### Render
- **New**: Alternative deployment
- **Cost**: 
  - Web Service: Free (with limitations) or $7/month
  - PostgreSQL: $7/month (but using Railway's DB)
  - Redis: Free (256MB) or $10/month
- **Free Tier**: 750 hours/month

**Total if using both:**
- Railway: $5-20/month
- Render: $0-7/month (if using free tier for web service only)

---

## ✅ Deployment Complete!

Once deployed successfully:
1. ✅ You have two working backends
2. ✅ Both share the same database
3. ✅ You can switch between them
4. ✅ High availability setup complete

**Next Steps:**
- Monitor both deployments for 24-48 hours
- Compare performance and reliability
- Decide which to use as primary
- Update frontend to use preferred backend

---

**Good luck with your Render deployment! 🚀**
