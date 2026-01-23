# Vercel Deployment Setup Guide

## Quick Fix for Your Deployment Issue

Your app works locally because you have a `.env` file with the required environment variables. Vercel deployments need these same variables configured in the Vercel dashboard.

---

## Step 1: Install Vercel CLI (Optional but Recommended)

```powershell
npm install -g vercel
```

Then login:
```powershell
vercel login
```

---

## Step 2: Set Environment Variables in Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your MediGuide project

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

3. **Add Each Variable**
   
   For each of these variables, click "Add New":
   
   | Variable Name | Value Source |
   |---------------|--------------|
   | `VITE_SUPABASE_URL` | Copy from your local `.env` file |
   | `VITE_SUPABASE_ANON_KEY` | Copy from your local `.env` file |
   | `VITE_API_URL` | Copy from your local `.env` file |

4. **Configure Environment**
   - For each variable, select: **Production**, **Preview**, and **Development**
   - This ensures the variables work in all environments

5. **Save**
   - Click "Save" for each variable

### Option B: Using Vercel CLI (Faster)

If you have Vercel CLI installed, run these commands from the `health-hub-pro` directory:

```powershell
# Link your project (if not already linked)
vercel link

# Add environment variables from your .env file
vercel env pull .env.local

# Or add them manually:
vercel env add VITE_SUPABASE_URL production
# (paste your value when prompted)

vercel env add VITE_SUPABASE_ANON_KEY production
# (paste your value when prompted)

vercel env add VITE_API_URL production
# (paste your value when prompted)
```

---

## Step 3: Redeploy

### Option A: Via Dashboard
1. Go to "Deployments" tab in Vercel
2. Click the three dots (⋯) on the latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache" (optional, faster)
5. Click "Redeploy"

### Option B: Via Git Push
Simply push to your main branch:
```powershell
git checkout main
git merge rahul-rushi
git push origin main
```

Vercel will automatically detect the push and redeploy.

### Option C: Via CLI
```powershell
cd health-hub-pro
vercel --prod
```

---

## Step 4: Verify Deployment

1. **Wait for Deployment**
   - Vercel will show deployment progress
   - Usually takes 1-2 minutes

2. **Check Build Logs**
   - Click on the deployment in Vercel dashboard
   - Review the "Building" logs
   - Look for "✓ Built in X.XXs" success message

3. **Test the Deployed App**
   - Click "Visit" or go to your deployment URL
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Test key features:
     - App loads without blank screen
     - ABDM redirect button works
     - Login/authentication works

---

## Common Issues

### Issue: "Environment variables not found"
**Solution:** Make sure you selected "Production" when adding variables, and redeploy after adding them.

### Issue: "Build succeeds but app shows blank page"
**Solution:** 
1. Open browser DevTools on deployed site
2. Check Console for errors
3. Usually means environment variables are missing or incorrect

### Issue: "Variables are set but still not working"
**Solution:**
1. Double-check variable names are **exact** (case-sensitive)
2. Ensure no extra spaces in values
3. Redeploy (sometimes Vercel needs a fresh deployment)

---

## What Your .env File Should Contain

Your local `.env` file should have these three variables:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=https://your-backend-url.com
```

Copy these **exact values** to Vercel.

---

## Need Help?

If you're still having issues after following these steps, check:
1. Vercel deployment logs for specific errors
2. Browser console on deployed site for runtime errors
3. That your backend (`VITE_API_URL`) is deployed and accessible
