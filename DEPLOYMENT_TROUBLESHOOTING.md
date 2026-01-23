# Deployment Troubleshooting Guide

## Issue: "UI updates work locally but fail in deployment"

### Quick Diagnosis Checklist

- [ ] **Environment Variables Set?** Check if all required variables are configured in your deployment platform
- [ ] **Build Succeeds?** Review deployment logs for build errors
- [ ] **Correct Branch Deployed?** Verify the deployment is pulling from the correct branch
- [ ] **Build Command Correct?** Ensure build command is `npm run build` or `vite build`

---

## Required Environment Variables

The frontend application requires these environment variables to function:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1...` |
| `VITE_API_URL` | Backend API base URL | `https://your-backend.railway.app` |

### Where to Find These Values

**Supabase Credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Settings → API
4. Copy "Project URL" and "anon/public" key

**Backend API URL:**
- Use your deployed backend URL (Railway, Render, etc.)
- For local testing: `http://localhost:8000`

---

## Platform-Specific Instructions

### Vercel Deployment

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase URL
   - Click "Add"
4. Repeat for `VITE_SUPABASE_ANON_KEY` and `VITE_API_URL`
5. **Redeploy** your application (Deployments → ⋯ → Redeploy)

### Netlify Deployment

1. Go to your site in Netlify Dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click "Add a variable"
4. Add each variable with its value
5. **Trigger new deploy** (Deploys → Trigger deploy → Deploy site)

### Railway Deployment

1. Open your project in Railway Dashboard
2. Select your frontend service
3. Go to **Variables** tab
4. Click "New Variable"
5. Add each variable
6. Railway will automatically redeploy

---

## Common Deployment Errors

### Error: "Supabase credentials not found"

**Cause:** Missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`

**Fix:**
1. Add both variables to your deployment platform
2. Ensure variable names are **exact** (case-sensitive)
3. Redeploy the application

### Error: "VITE_API_URL is not defined"

**Cause:** Missing backend API URL

**Fix:**
1. Add `VITE_API_URL` with your deployed backend URL
2. Ensure the backend is deployed and accessible
3. Redeploy the frontend

### Error: "Failed to fetch" or CORS errors

**Cause:** Backend URL incorrect or backend not running

**Fix:**
1. Verify `VITE_API_URL` points to correct backend
2. Check backend deployment is successful
3. Ensure backend CORS is configured to allow frontend domain

### Build succeeds but app shows blank page

**Cause:** Runtime errors due to missing environment variables

**Fix:**
1. Open browser DevTools (F12) on deployed site
2. Check Console tab for errors
3. Look for environment variable related errors
4. Add missing variables and redeploy

---

## Verification Steps

After setting environment variables and redeploying:

1. **Check Build Logs**
   - Ensure build completes without errors
   - Look for "✓ built in X.XXs" success message

2. **Test Deployed App**
   - Navigate to your deployed URL
   - Open browser DevTools (F12)
   - Check Console for errors
   - Verify app loads correctly

3. **Test Key Features**
   - Login/Authentication (tests Supabase connection)
   - API calls (tests backend connection)
   - ABDM redirect button (tests UI functionality)

---

## Still Having Issues?

1. **Check deployment logs** for specific error messages
2. **Compare with local** - Does `npm run build` work locally?
3. **Verify branch** - Is the correct branch being deployed?
4. **Check build settings**:
   - Build command: `npm run build` or `vite build`
   - Output directory: `dist`
   - Install command: `npm install`

5. **Review recent commits** - Did the last commit introduce breaking changes?

---

## Contact Information

If you continue experiencing issues, gather this information:
- Deployment platform (Vercel/Netlify/Railway)
- Full error message from deployment logs
- Screenshot of environment variables configuration
- Browser console errors (if app deploys but doesn't work)
