# 🚀 Deployment Guide - CVC Web Solutions

## 📋 Overview

This project uses **GitHub Actions** for automated deployment to your production server. When you push code to the `master` branch, it automatically deploys to production.

---

## 🔐 Initial Setup (One-Time)

### 1. Set up GitHub Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these three secrets:

| Secret Name | Value |
|------------|-------|
| `PROD_HOST` | `5.9.123.208` |
| `PROD_USER` | `ploi` |
| `PROD_SSH_KEY` | Your private SSH key from `C:\Users\craig\.ssh\id_ed25519` |

**To get your SSH key:**
```bash
# On Windows (PowerShell or Git Bash)
cat C:\Users\craig\.ssh\id_ed25519
```
Copy the entire output (including `-----BEGIN` and `-----END` lines)

### 2. Prepare Production Server

SSH into your production server and set up the project:

```bash
# SSH into server
ssh ploi@5.9.123.208

# Create project directory
mkdir -p /home/ploi/containers/cvcwebsolutionscom
cd /home/ploi/containers/cvcwebsolutionscom

# Clone your repository
git clone https://github.com/YOUR_USERNAME/cvcwebsolutions.git .

# Copy environment template
cp .env.production.example .env.production

# Edit with real credentials
nano .env.production
```

Fill in your actual credentials:
- Google Calendar API key
- Zoom API credentials
- OpenAI API key
- Payload secret

### 3. Make deploy script executable

```bash
chmod +x deploy.sh
```

---

## 🔄 How Database Persistence Works

### **Database is SAFE during deployments!**

The SQLite database file is stored **outside the Docker container** using volume mounting:

```yaml
volumes:
  - ./data:/app/data              # Database persists here
  - ./public/media:/app/public/media
  - ./public/screenshots:/app/public/screenshots
```

**What this means:**
- Database file: `/home/ploi/containers/cvcwebsolutionscom/data/payload.db`
- When you rebuild containers, this directory stays intact
- Only the **application code** is updated, not the data
- Automatic backups created before each deployment

**Backup files are stored in:**
```
/home/ploi/containers/cvcwebsolutionscom/data/payload.db.backup.YYYYMMDD_HHMMSS
```
(Last 5 backups are kept automatically)

---

## 🚀 Deployment Workflow

### **Automatic Deployment (Recommended)**

1. Make changes locally in VSCode
2. Test locally: `npm run dev`
3. Commit your changes:
   ```bash
   git add .
   git commit -m "Your change description"
   ```
4. Push to GitHub:
   ```bash
   git push origin master
   ```
5. **Done!** GitHub Actions automatically deploys to production

**Watch deployment progress:**
- Go to your GitHub repository
- Click "Actions" tab
- See real-time deployment logs

### **Manual Deployment**

If you need to deploy manually:

```bash
# SSH into server
ssh ploi@5.9.123.208

# Run deployment script
cd /home/ploi/containers/cvcwebsolutionscom
./deploy.sh
```

### **Manual Trigger from GitHub**

You can also trigger deployment without pushing code:
1. Go to GitHub repository → Actions
2. Click "Deploy to Production" workflow
3. Click "Run workflow" → Run workflow

---

## 📊 What Happens During Deployment

```
1. 📥 Pull latest code from GitHub
2. 💾 Backup database (keeps last 5 backups)
3. 🛑 Stop old container (volumes remain intact)
4. 🔨 Build new Docker image with updated code
5. 🚀 Start new container
6. ✅ Verify deployment success
7. 🧹 Clean up old Docker images
```

**Total downtime:** ~30-60 seconds

---

## 🔍 Monitoring & Troubleshooting

### Check if site is running:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Restart without rebuilding:
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Access container shell:
```bash
docker exec -it cvcwebsolutions-app sh
```

### Check database:
```bash
ls -lh /home/ploi/containers/cvcwebsolutionscom/data/
```

---

## 🔒 Security Features

✅ **Admin panel blocked in production** (`NODE_ENV=production`)
- All `/admin/*` routes return 404
- Admin API routes return 404
- Enforced by `src/middleware.ts`

✅ **Environment variables** never committed to Git
✅ **Database backups** before each deployment
✅ **Automatic cleanup** of old Docker images

---

## 📧 Email Notifications

Appointment emails are sent automatically to **craig@cvcwebsolutions.com** when:
- Someone books a consultation
- Google Calendar event is created
- Zoom meeting is scheduled

No admin panel needed!

---

## 🆘 Emergency Rollback

If deployment breaks something:

```bash
# SSH into server
ssh ploi@5.9.123.208
cd /home/ploi/containers/cvcwebsolutionscom

# Restore previous database backup
cp data/payload.db.backup.YYYYMMDD_HHMMSS data/payload.db

# Rollback code to previous commit
git log  # Find previous commit hash
git reset --hard COMMIT_HASH

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📝 Common Tasks

### Update environment variables:
```bash
ssh ploi@5.9.123.208
nano /home/ploi/containers/cvcwebsolutionscom/.env.production
docker-compose -f docker-compose.prod.yml restart
```

### View database size:
```bash
ssh ploi@5.9.123.208
du -h /home/ploi/containers/cvcwebsolutionscom/data/payload.db
```

### Manually backup database:
```bash
ssh ploi@5.9.123.208
cd /home/ploi/containers/cvcwebsolutionscom
cp data/payload.db data/payload.db.manual.$(date +%Y%m%d_%H%M%S)
```

---

## ✅ Deployment Checklist

Before first deployment:

- [ ] GitHub secrets configured (PROD_HOST, PROD_USER, PROD_SSH_KEY)
- [ ] Repository cloned on production server
- [ ] `.env.production` created with real credentials
- [ ] `deploy.sh` made executable
- [ ] Test deployment manually first
- [ ] Verify email notifications work
- [ ] Confirm admin routes return 404

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Deploy | `git push origin master` (automatic) |
| View logs | `ssh ploi@5.9.123.208 "docker-compose -f /home/ploi/containers/cvcwebsolutionscom/docker-compose.prod.yml logs"` |
| Restart | `ssh ploi@5.9.123.208 "docker-compose -f /home/ploi/containers/cvcwebsolutionscom/docker-compose.prod.yml restart"` |
| Check status | `ssh ploi@5.9.123.208 "docker-compose -f /home/ploi/containers/cvcwebsolutionscom/docker-compose.prod.yml ps"` |

---

**Questions?** Check the logs first, then review this guide.
