# Railway Deployment Guide

## 🚀 Quick Deploy to Railway

### Step 1: Configure Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose **`kolaq-project`** repository

### Step 2: Configure Root Directory

Railway needs to know we're deploying from the `backend` folder:

1. After selecting repo, go to **Settings**
2. Find **"Root Directory"** or **"Service Settings"**
3. Set Root Directory to: `backend`
4. Save settings

### Step 3: Add Environment Variables

Go to **Variables** tab and add these:

```env
DATABASE_URL=postgresql://postgres:Kolaqbitters$@db.cvnkngvghhxbnforkxer.supabase.co:5432/postgres
JWT_SECRET=+pFngbBSq+9TzI02czzBsLgqke6bc+KrUxv8kgUPazV0IisS/zsQXoCDDg2Euhd/j2u5IVNq+SaRwk2NbaKFsA==
JWT_EXPIRATION=3600m
NODE_ENV=production
PORT=4000
```

**Important**: 
- Click "Add" for each variable
- Don't include the `$` sign - Railway will handle it
- For `DATABASE_URL`, if you have issues, try URL encoding the password: `Kolaqbitters%24`

### Step 4: Configure Build Settings (Optional)

Railway should auto-detect NestJS, but if needed:

**Build Command**:
```bash
npm install && npx prisma generate && npm run build
```

**Start Command**:
```bash
npm run start:prod
```

### Step 5: Deploy!

1. Click **"Deploy"** or push to GitHub (auto-deploys)
2. Watch the logs for any errors
3. Once deployed, you'll get a URL like: `https://your-app.railway.app`

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module '@nestjs/cli'"
**Solution**: Already fixed - moved `@nestjs/cli` to dependencies

### Issue 2: "Cannot find module 'dist/main.js'"
**Solution**: Already fixed - updated to `dist/src/main.js`

### Issue 3: "Prisma Client not generated"
**Solution**: Build command includes `npx prisma generate`

### Issue 4: Database connection fails
**Solutions**:
1. Check if Supabase project is active
2. Try URL-encoded password in DATABASE_URL: `Kolaqbitters%24`
3. Whitelist Railway's IPs in Supabase (or disable IP restrictions)
4. Check Railway logs for exact error

### Issue 5: Port already in use
**Solution**: Railway automatically assigns PORT - make sure you're using `process.env.PORT`

---

## 📋 Deployment Checklist

Before deploying:
- [x] `@nestjs/cli` in dependencies
- [x] `prisma` in dependencies
- [x] `typescript` in dependencies
- [x] `ts-node` in dependencies
- [x] `start:prod` script points to `dist/src/main.js`
- [x] `railway.json` configuration file
- [x] `nixpacks.toml` for build config
- [x] `Procfile` for process definition
- [ ] Environment variables set in Railway
- [ ] Root directory set to `backend`
- [ ] Database accessible from Railway

---

## 📊 What Railway Does

1. **Detects**: NestJS project via `package.json`
2. **Installs**: Runs `npm install`
3. **Generates**: Runs `npx prisma generate`
4. **Builds**: Runs `npm run build`
5. **Starts**: Runs `npm run start:prod`
6. **Exposes**: Your app on Railway's domain

---

## 🔍 Monitoring

### View Logs
```bash
# In Railway dashboard
1. Go to your service
2. Click "Logs" tab
3. Watch for errors
```

### Common Log Messages

**Success**:
```
🚀 Backend running on http://localhost:4000
📚 API endpoints available at http://localhost:4000/api/v1
[Nest] Application successfully started
```

**Database Connection Issue**:
```
Failed to connect to Postgres - will retry on first request
Can't reach database server at ...
```

**Build Success**:
```
Successfully compiled
Nest application successfully started
```

---

## 🎯 After Successful Deploy

1. **Copy your Railway URL** (e.g., `https://backend-production-xxxx.up.railway.app`)
2. **Test the API**:
   ```bash
   curl https://your-railway-url.railway.app
   # Should return "Hello World!"
   
   curl https://your-railway-url.railway.app/api/v1/products
   # Should return products list
   ```
3. **Update frontend** with this URL
4. **Update CORS** in `main.ts` to include frontend domain
5. **Redeploy** if CORS was updated

---

## 💡 Pro Tips

1. **Auto-Deploy**: Push to GitHub → Railway auto-deploys
2. **Preview Deploys**: PRs get preview URLs
3. **Rollback**: Can rollback to previous deploys easily
4. **Metrics**: Monitor CPU, RAM, bandwidth in Railway dashboard
5. **Custom Domain**: Can add your own domain in Railway settings

---

## 🆘 Still Having Issues?

### Check These:

1. **Logs Tab**: Always check deployment logs first
2. **Build Logs**: Look for `npm install` or `npm run build` errors
3. **Runtime Logs**: Check for startup errors
4. **Environment Variables**: Make sure all are set correctly
5. **Root Directory**: Must be set to `backend`

### Error Messages to Look For:

- `Module not found` → Missing dependency
- `Cannot find module` → Wrong path in package.json
- `Database connection failed` → DATABASE_URL issue
- `Port already in use` → Don't hardcode PORT
- `CORS error` → Update CORS origins

---

## ✅ Success Indicators

You'll know it worked when you see:
- ✅ Build completed successfully
- ✅ "Nest application successfully started" in logs
- ✅ Can access Railway URL in browser
- ✅ API endpoints return data (not 500 errors)
- ✅ Service status shows "Active"

---

## 📝 Next Steps After Deploy

1. Update frontend `NEXT_PUBLIC_API_URL` with Railway URL
2. Deploy frontend to Vercel
3. Update CORS in backend with Vercel URL
4. Test full integration
5. Celebrate! 🎉

---

**Your backend should now be live on Railway!** 🚀
