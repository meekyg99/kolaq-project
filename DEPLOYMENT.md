# Deployment Guide

## 🚀 Deploying to Vercel

### Backend Deployment

Since Vercel is primarily for frontend/serverless, you have a few options for the backend:

#### Option 1: Railway (Recommended for NestJS)
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `kolaq-project` repository
5. Choose `backend` folder as root directory
6. Add environment variables:
   ```
   DATABASE_URL=postgresql://postgres:Kolaqbitters$@db.cvnkngvghhxbnforkxer.supabase.co:5432/postgres
   JWT_SECRET=+pFngbBSq+9TzI02czzBsLgqke6bc+KrUxv8kgUPazV0IisS/zsQXoCDDg2Euhd/j2u5IVNq+SaRwk2NbaKFsA==
   JWT_EXPIRATION=3600m
   PORT=4000
   NODE_ENV=production
   ```
7. Deploy!

Railway will:
- Auto-detect NestJS
- Run `npm install`
- Run `npm run build`
- Run `npm run start:prod`

#### Option 2: Render
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `node dist/src/main.js`
   - **Environment**: Node
5. Add environment variables (same as above)

#### Option 3: Heroku
```bash
cd backend
heroku create kolaq-alagbo-backend
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set JWT_SECRET="..."
heroku config:set JWT_EXPIRATION="3600m"
git subtree push --prefix backend heroku main
```

---

### Frontend Deployment to Vercel

#### Step 1: Prepare Frontend
1. **Update `.env.local`** with production backend URL:
   ```bash
   cd frontend
   # Create .env.production
   echo "NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app" > .env.production
   ```

#### Step 2: Deploy to Vercel
```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

Or use Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import Project
3. Select `kolaq-project` repo
4. **Root Directory**: `frontend`
5. Framework Preset: **Next.js**
6. Add environment variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.railway.app`
7. Deploy!

---

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:Kolaqbitters$@db.cvnkngvghhxbnforkxer.supabase.co:5432/postgres
JWT_SECRET=+pFngbBSq+9TzI02czzBsLgqke6bc+KrUxv8kgUPazV0IisS/zsQXoCDDg2Euhd/j2u5IVNq+SaRwk2NbaKFsA==
JWT_EXPIRATION=3600m
PORT=4000
NODE_ENV=production
RESEND_API_KEY=your-key-here  # Optional
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

---

## 📋 Pre-Deployment Checklist

### Backend
- [x] All modules built
- [x] Environment variables configured
- [x] Database schema applied
- [x] Admin user seeded
- [x] CORS configured for production domain
- [ ] Update CORS in `main.ts` to include production frontend URL
- [ ] Test database connection from deployment platform

### Frontend
- [x] API client configured
- [x] All hooks created
- [x] Environment variables set
- [ ] Update API URL to production backend
- [ ] Test build locally: `npm run build`

---

## 🔄 Update CORS for Production

Before deploying, update `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app',  // Add this
    'https://kolaq-alagbo.vercel.app',          // Your actual domain
  ],
  credentials: true,
});
```

---

## 🧪 Testing Production

### Backend
```bash
# Test backend health
curl https://your-backend-url.railway.app

# Test API
curl https://your-backend-url.railway.app/api/v1/products
```

### Frontend
1. Visit your Vercel URL
2. Check browser console for errors
3. Test product listing
4. Test add to cart
5. Test checkout flow

---

## 🐛 Common Issues

### Issue: Backend "Internal Server Error"
**Solution**: Check database connection
- Verify DATABASE_URL is correct
- Check if Supabase project is active
- Whitelist deployment platform IP in Supabase

### Issue: Frontend can't connect to backend
**Solution**: Check CORS
- Add frontend domain to backend CORS config
- Rebuild and redeploy backend

### Issue: Environment variables not loading
**Solution**: 
- Check variable names match exactly
- Restart deployment after adding variables
- Check deployment logs

---

## 📊 Deployment Architecture

```
┌─────────────────────┐
│   Vercel Frontend   │
│   (Next.js App)     │
└──────────┬──────────┘
           │
           │ HTTPS
           │
┌──────────▼──────────┐
│  Railway Backend    │
│   (NestJS API)      │
└──────────┬──────────┘
           │
           │ PostgreSQL
           │
┌──────────▼──────────┐
│   Supabase DB       │
│   (PostgreSQL)      │
└─────────────────────┘
```

---

## 🎯 Post-Deployment

1. **Test all features**
2. **Seed products** if needed
3. **Create admin user** via seed script
4. **Test admin login**
5. **Monitor logs** for errors
6. **Set up custom domain** (optional)

---

## 📝 Useful Commands

### Railway CLI
```bash
npm install -g @railway/cli
railway login
railway link
railway logs
railway run npm run seed
```

### Vercel CLI
```bash
vercel --prod              # Deploy to production
vercel logs                # View logs
vercel env add             # Add environment variable
vercel domains             # Manage domains
```

---

## ✅ Success!

Once deployed:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`
- API Docs: Available at backend URL + `/api/v1`

**Your e-commerce platform is live!** 🎉
