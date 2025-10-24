# Seattle LMS - Railway Deployment

**Status:** 🚧 Migration in Progress  
**Source:** Legacy Seattle LMS codebase  
**Target:** Railway + MongoDB Atlas  
**Migration Template:** Based on successful OneWorld LMS migration

---

## Overview

Seattle LMS verbatim migration to Railway.com infrastructure with MongoDB Atlas database.

**Key Points:**
- ✅ Zero code changes (frozen codebase)
- ✅ Proven migration process (from OneWorld template)
- ✅ Modern infrastructure (Railway + Atlas)
- ✅ Full deployment automation

---

## Quick Start

### Prerequisites
- MongoDB Atlas `seattle-lms` database created
- Railway service configured
- Environment variables set in Railway

### Deployment Steps
1. **MongoDB Atlas:** Create `seattle-lms` database with user `seattle_user`
2. **Railway:** Create service from GitHub repo `antonmogul/seattle-lms`
3. **Environment:** Add variables from `.env.example` to Railway
4. **Deploy:** Railway auto-deploys on push to main branch
5. **Migrate Data:** Run data migration script
6. **Test:** Verify functionality
7. **Cutover:** Update Webflow to point to Railway URL

---

## Architecture

### Stack
- **Backend:** Express.js + TypeScript + GraphQL (Apollo Server)
- **Database:** MongoDB Atlas (collection-per-tenant)
- **Frontend:** Webflow + xAtom framework
- **Build:** Turborepo monorepo
- **Deployment:** Railway.com
- **File Storage:** AWS S3 (seattle-lms-prod bucket)
- **Email:** Postmark

### Project Structure
```
seattle-lms/
├── apps/
│   ├── client/     # xAtom/Webflow integration
│   └── server/     # GraphQL API server
├── packages/
│   ├── orm/        # Prisma database models
│   └── client-utils/ # Shared utilities
├── .env.example    # Environment template
└── README.md       # This file
```

---

## Environment Variables

See `.env.example` for complete list. Critical variables:

- `DATABASE_URL` - MongoDB Atlas connection string
- `JWT_SECRET` - Authentication secret
- `API_PORT=${{PORT}}` - Railway port binding
- `ENVIRONMENT=production`
- `AWS_ACCESS_KEY_ID` - S3 access
- `AWS_SECRET_ACCESS_KEY` - S3 secret
- `AWS_S3_BUCKET_NAME=seattle-lms-prod`
- `POSTMARK_SERVER_TOKEN` - Email service
- `WEBFLOW_TOKEN` - Webflow API access

---

## Data Migration

### SSH to Old Server
```bash
ssh -i ~/Downloads/Keys/seattle-lms-live.pem ubuntu@OLD_SERVER_IP
```

### Export Database
```bash
mongodump --db seattle-lms-prod --out ./seattle-backup
tar -czf seattle-backup.tar.gz seattle-backup/
```

### Download and Import
```bash
scp -i ~/Downloads/Keys/seattle-lms-live.pem ubuntu@OLD_SERVER_IP:~/seattle-backup.tar.gz ~/Downloads/
cd ~/Downloads && tar -xzf seattle-backup.tar.gz
mongorestore --uri="ATLAS_URI" --nsFrom='seattle-lms-prod.*' --nsTo='seattle-lms.*' ./seattle-backup/seattle-lms-prod/
```

---

## Testing Checklist

After deployment:
- [ ] Server starts without errors
- [ ] GraphQL endpoint responds
- [ ] User login works
- [ ] User sign-up works
- [ ] Course data loads
- [ ] Email notifications work
- [ ] File uploads work (S3)
- [ ] Webflow integration works

---

## Deployment Timeline

Based on OneWorld migration experience:

- **Prep & Setup:** 15 minutes
- **Railway Config:** 30 minutes
- **Data Migration:** 45 minutes
- **Testing:** 30 minutes
- **Cutover:** 15 minutes

**Total:** ~2 hours

---

## Repository Information

- **GitHub:** https://github.com/antonmogul/seattle-lms
- **Branch:** main
- **Build Command:** `yarn build`
- **Start Command:** `yarn workspace server run start`
- **Node Version:** 22.x

---

## Support

### Railway Dashboard
- URL: https://railway.app/
- Logs: Real-time application logs
- Metrics: CPU, memory, network

### MongoDB Atlas
- URL: https://cloud.mongodb.com/
- Database: seattle-lms
- Cluster: unifiedlms.lvywnng.mongodb.net

---

## Notes

**This is a verbatim migration - NO code changes allowed.**

All improvements and features will be implemented in the unified platform.

---

**Last Updated:** October 24, 2025  
**Migration Status:** In Progress  
**Based On:** OneWorld LMS successful migration template
