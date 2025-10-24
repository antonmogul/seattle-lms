# Seattle LMS - Railway Deployment Guide

**Repository:** https://github.com/antonmogul/seattle-lms  
**Status:** Ready for Railway deployment  
**Date:** October 24, 2025

---

## 🎯 Deployment Steps

### Step 1: MongoDB Atlas Setup

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Navigate to Database Access**:
   - Click "Database Access" in left sidebar
   - Click "+ ADD NEW DATABASE USER"
   
3. **Create Seattle User**:
   - Username: `seattle_user`
   - Password: Generate a strong password (save for later)
   - Database User Privileges: Select "Read and write to any database"
   - Click "Add User"

4. **Get Connection String**:
   ```
   mongodb+srv://seattle_user:YOUR_PASSWORD@unifiedlms.lvywnng.mongodb.net/seattle-lms?retryWrites=true&w=majority&appName=UnifiedLMS
   ```
   Replace `YOUR_PASSWORD` with the password from step 3

---

### Step 2: Create Railway Service

1. **Login to Railway**: https://railway.app/
2. **Navigate to Project**: UnifiedLMS project
3. **Create New Service**:
   - Click "+ New"
   - Select "GitHub Repo"
   - Choose repository: `antonmogul/seattle-lms`
   - Branch: `main`

---

### Step 3: Configure Environment Variables in Railway

Navigate to the new Seattle LMS service → Variables tab, and add these variables:

#### Required Variables Template

```bash
# Database
DATABASE_URL=mongodb+srv://seattle_user:YOUR_MONGODB_PASSWORD@unifiedlms.lvywnng.mongodb.net/seattle-lms?retryWrites=true&w=majority&appName=UnifiedLMS

# Security (Generate new secret with: openssl rand -base64 32)
JWT_SECRET=YOUR_NEW_JWT_SECRET

# Server
NODE_ENV=production
ENVIRONMENT=production
API_PORT=${{PORT}}

# AWS S3 (Get from seattle.env in original repo)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_S3_BUCKET_NAME=seattle-lms-prod
AWS_REGION=us-east-1

# Email - Postmark (Get from seattle.env in original repo)
POSTMARK_SERVER_TOKEN=your-postmark-token
POSTMARK_FROM_EMAIL=tourism@visitseattle.org

# Webflow (Get from seattle.env in original repo)
WEBFLOW_TOKEN=your-webflow-token

# Google OAuth (Get from original global.ts)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret

# CORS
CORS_ALLOWED_ORIGINS=https://seattle-lms.webflow.io,https://www.seattledestinationtraining.org,https://studio.apollographql.com
```

**CREDENTIALS LOCATION:**
The actual credential values are in:
- `/Users/antonmorrison/Documents/GitHub/MogulLMS/seattle-lms/seattle.env` (AWS, Postmark, Webflow)
- `/Users/antonmorrison/Documents/GitHub/MogulLMS/seattle-lms/apps/server/src/config/global.ts` (Google OAuth - lines 44, 46)

---

### Step 4: Configure Railway Build Settings

1. **Settings → Build**:
   - Build Command: `yarn install && yarn build`
   - Start Command: `yarn start`
   
2. **Settings → Networking**:
   - Generate Domain (or use custom domain)
   - Note the Railway URL (e.g., `seattle-lms-production.up.railway.app`)

---

### Step 5: Deploy and Monitor

1. **Trigger Deployment**:
   - Railway will automatically deploy when variables are configured
   - Monitor deployment in "Deployments" tab

2. **Check Build Logs**:
   - Watch for successful build completion
   - Verify no critical errors

3. **Test Deployment**:
   - Once deployed, visit the Railway URL
   - You should see the GraphQL playground at `/api/graphql`

---

## 📊 Data Migration Steps

**IMPORTANT:** Do NOT start data migration until Railway deployment is confirmed working.

### Step 1: Access Legacy Server

```bash
# Fix SSH key permissions
chmod 400 ~/Downloads/Keys/seattle-lms-live.pem

# Connect to legacy server
ssh -i ~/Downloads/Keys/seattle-lms-live.pem ubuntu@54.212.11.87
```

### Step 2: Export Production Data

```bash
# On legacy server
mongodump --uri="mongodb://localhost:27017/seattle-lms" --out=/tmp/seattle-dump --gzip

# Create archive
cd /tmp
tar -czf seattle-dump.tar.gz seattle-dump/

# Exit server
exit
```

### Step 3: Download Data to Local Machine

```bash
# On local machine
scp -i ~/Downloads/Keys/seattle-lms-live.pem \
  ubuntu@54.212.11.87:/tmp/seattle-dump.tar.gz \
  ~/Downloads/
```

### Step 4: Restore to MongoDB Atlas

```bash
# Extract archive
cd ~/Downloads
tar -xzf seattle-dump.tar.gz

# Restore to Atlas (replace YOUR_PASSWORD)
mongorestore \
  --uri="mongodb+srv://seattle_user:YOUR_PASSWORD@unifiedlms.lvywnng.mongodb.net/seattle-lms?retryWrites=true&w=majority&appName=UnifiedLMS" \
  --gzip \
  seattle-dump/seattle-lms/
```

### Step 5: Verify Migration

```bash
# Count documents in each collection
mongosh "mongodb+srv://seattle_user:YOUR_PASSWORD@unifiedlms.lvywnng.mongodb.net/seattle-lms?retryWrites=true&w=majority&appName=UnifiedLMS" \
  --eval "
    db.User.countDocuments();
    db.Course.countDocuments();
    db.Lesson.countDocuments();
    db.Quiz.countDocuments();
    db.Resource.countDocuments();
  "
```

---

## ✅ Post-Migration Testing

### 1. Test Authentication
- Visit Railway URL `/api/graphql`
- Test login mutation with existing user
- Verify JWT token is returned

### 2. Test Course Access
- Query courses for a logged-in user
- Verify course data loads correctly

### 3. Test Email Service
- Trigger password reset for test user
- Verify email is received via Postmark

### 4. Test File Uploads
- Upload a file through the application
- Verify it's stored in `seattle-lms-prod` S3 bucket

### 5. Test Google Analytics Integration
- Verify GA integration is working (if applicable)

---

## 🔄 Webflow Update (FINAL STEP)

**Only do this after ALL testing is complete!**

1. **Login to Webflow**: https://webflow.com/
2. **Open Seattle LMS site**
3. **Update API URL** in site settings:
   - Old: `https://seattle-lms-api.devlab.zone`
   - New: `https://seattle-lms-production.up.railway.app` (or your Railway URL)
4. **Publish site changes**

---

## 📋 Verification Checklist

Before considering migration complete:

- [ ] Railway service deployed successfully
- [ ] MongoDB Atlas user `seattle_user` created
- [ ] All environment variables configured in Railway
- [ ] Build completed without errors
- [ ] GraphQL playground accessible
- [ ] Data migrated from legacy server
- [ ] Document counts match between legacy and Atlas
- [ ] User authentication working
- [ ] Course data loading correctly
- [ ] Email service functional (Postmark)
- [ ] File uploads working (S3)
- [ ] Google OAuth working (if used)
- [ ] Webflow pointing to new Railway URL
- [ ] Legacy server gracefully shut down (after verification period)

---

## 🚨 Rollback Plan

If issues occur:

1. **Quick Rollback**: Update Webflow to point back to old URL
2. **Database Rollback**: Legacy MongoDB is untouched during migration
3. **Code Rollback**: Git repository has full history

---

## 📞 Support & Resources

- **OneWorld Migration**: Similar setup completed successfully (reference guide)
- **Railway Docs**: https://docs.railway.app/
- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas/
- **GitHub Repo**: https://github.com/antonmogul/seattle-lms

---

## 🎉 Estimated Timeline

- MongoDB Atlas setup: 5 minutes
- Railway service creation: 5 minutes
- Environment variable configuration: 10 minutes
- Initial deployment: 10-15 minutes
- Data migration: 15-30 minutes (depending on data size)
- Testing: 30-60 minutes
- Webflow update: 5 minutes

**Total: ~2-3 hours** (including thorough testing)

---

*Last updated: October 24, 2025*
