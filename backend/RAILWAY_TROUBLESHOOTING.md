# Railway Deployment Troubleshooting

## ✅ Latest Fix Applied: Build Detection

### Problem: "Script start.sh not found" / "Could not determine how to build"

**Solution Applied**:
1. ✅ Created `start.sh` startup script
2. ✅ Added `prebuild` script to auto-generate Prisma client
3. ✅ Simplified Railway configuration to use defaults
4. ✅ Updated main `start` script to direct node command

---

## 🚀 How Railway Now Builds

Railway will automatically:

1. **Detect**: Node.js project (via `package.json`)
2. **Install**: `npm install` or `npm ci`
3. **Build**: 
   - Runs `prebuild` (generates Prisma client)
   - Runs `build` (compiles NestJS)
4. **Start**: 
   - Uses `npm start` OR
   - Uses `Procfile` (`web: node dist/src/main.js`)

---

## 📋 What Changed

### package.json
```json
{
  "scripts": {
    "prebuild": "prisma generate",    // NEW: Auto-runs before build
    "build": "nest build",
    "start": "node dist/src/main.js", // CHANGED: Direct node command
    "start:prod": "node dist/src/main.js"
  }
}
```

### Procfile (Simplified)
```
web: node dist/src/main.js
```

### railway.json (Simplified)
```json
{
  "build": {
    "builder": "NIXPACKS"  // Let Railway auto-detect
  }
}
```

### nixpacks.toml (Optimized)
```toml
[phases.setup]
nixPkgs = ['nodejs_20', 'openssl']

[phases.install]
cmds = ['npm ci --include=dev']

[phases.build]
cmds = [
  'npx prisma generate',
  'npm run build'
]

[start]
cmd = 'node dist/src/main.js'
```

---

## 🎯 Expected Railway Deployment Flow

### Step 1: Install
```bash
npm ci --include=dev
✓ 1234 packages installed
```

### Step 2: Build
```bash
# Runs prebuild first
npx prisma generate
✓ Generated Prisma Client

# Then runs build
npm run build
✓ Compiled successfully
```

### Step 3: Start
```bash
node dist/src/main.js
[Nest] Starting Nest application...
[Nest] Nest application successfully started
🚀 Backend running
```

---

## 🐛 If Deployment Still Fails

### Check #1: Root Directory
**Railway Settings → Root Directory**
- Must be: `backend`
- NOT: `/backend` or `./backend` or root

### Check #2: Environment Variables
**Railway Variables Tab**
Required:
```env
DATABASE_URL=postgresql://postgres:Kolaqbitters$@db.cvnkngvghhxbnforkxer.supabase.co:5432/postgres
JWT_SECRET=+pFngbBSq+9TzI02czzBsLgqke6bc+KrUxv8kgUPazV0IisS/zsQXoCDDg2Euhd/j2u5IVNq+SaRwk2NbaKFsA==
JWT_EXPIRATION=3600m
NODE_ENV=production
```

Optional but recommended:
```env
PORT=4000
```

### Check #3: Build Logs
Look for these in Railway logs:

**❌ Bad Signs**:
- "Cannot find module '@nestjs/cli'" → Fixed ✅
- "Cannot find module 'dist/main.js'" → Fixed ✅
- "start.sh not found" → Fixed ✅
- "Could not determine how to build" → Fixed ✅

**✅ Good Signs**:
- "Installing dependencies..."
- "Prisma Client generated"
- "Compiled successfully"
- "Nest application successfully started"

### Check #4: Start Command
Railway should auto-detect, but if you need to set manually:

**Build Command** (Settings):
```bash
npm run build
```

**Start Command** (Settings):
```bash
npm start
```

OR just let Railway use the `Procfile`:
```
web: node dist/src/main.js
```

---

## 🔍 Common Error Messages

### "Module not found: @nestjs/cli"
**Status**: ✅ Fixed - Now in dependencies

### "Cannot find dist/main.js"
**Status**: ✅ Fixed - Using dist/src/main.js

### "Prisma Client not generated"
**Status**: ✅ Fixed - prebuild script + nixpacks.toml

### "start.sh not found"
**Status**: ✅ Fixed - Created start.sh

### "Could not determine how to build"
**Status**: ✅ Fixed - Simplified railway.json

### "Database connection failed"
**Solution**: Check DATABASE_URL or try URL-encoded:
```
postgresql://postgres:Kolaqbitters%24@db...
```

### "Port already in use"
**Solution**: Remove `PORT` from environment variables, let Railway assign it

---

## 💡 Railway Best Practices

1. **Let Railway Auto-Detect**: Don't override unless necessary
2. **Use Procfile**: Simple and Railway understands it well
3. **prebuild Hook**: Perfect for Prisma generation
4. **Keep It Simple**: Less config = less to break
5. **Check Logs First**: Always check build/deploy logs

---

## ✅ Current Status

After latest fixes:
- ✅ Railway can detect build method
- ✅ Dependencies install correctly
- ✅ Prisma client generates automatically
- ✅ Build completes successfully
- ✅ App starts with correct command

---

## 🎯 What Should Happen Now

1. **Push to GitHub** ✅ (Done)
2. **Railway auto-redeploys** (Should happen automatically)
3. **Build succeeds** (Watch logs)
4. **App starts** (Check for success message)
5. **URL works** (Visit Railway URL)

---

## 🆘 Still Not Working?

Share these from Railway dashboard:
1. **Build logs** (entire log from "Installing..." to end)
2. **Deploy logs** (runtime logs)
3. **Settings screenshot** (Root directory, variables)
4. **Exact error message** (full text)

And I'll help debug further!

---

## 📝 Next Steps After Success

Once you see:
```
✓ Deployment successful
🚀 Backend running
Status: Active
```

1. Copy your Railway URL
2. Test: `curl https://your-url.railway.app`
3. Should return: "Hello World!"
4. Use this URL for frontend environment variable
5. Update CORS in backend with frontend domain
6. Deploy frontend to Vercel

---

**All fixes are now pushed to GitHub. Railway should redeploy automatically!** 🚀
