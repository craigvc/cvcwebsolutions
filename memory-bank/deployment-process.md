# CVC Web Solutions - Deployment Process

## Overview
The CVC Web Solutions website is deployed to a production server at `5.9.123.208` (ploi@5.9.123.208) using Docker containers managed by Docker Compose.

## Deployment Steps

### 1. Stage Changes
```bash
git add <files>
```
Stage all modified files that should be included in the deployment.

### 2. Commit Changes
```bash
git commit -m "$(cat <<'EOF'
Your commit message here

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```
Create a descriptive commit message explaining the changes.

### 3. Push to Remote Repository
```bash
git push
```
Push the changes to GitHub (origin/master).

### 4. Copy Database and Media Files to Production (if needed)
```bash
# Copy database (if you made local database changes)
scp data/payload.db ploi@5.9.123.208:/home/ploi/cvcwebsolutions/data/payload.db

# Copy media files (if you added new images)
scp -r public/media/* ploi@5.9.123.208:/home/ploi/cvcwebsolutions/public/media/
```
**IMPORTANT**: Only run these if you've made changes to the database or media files locally. The Docker build copies the code but NOT the database or uploaded media files.

### 5. Build Docker Image on Production Server
```bash
ssh ploi@5.9.123.208 "cd ~/cvcwebsolutions && docker compose -f docker-compose.prod.yml build --no-cache 2>&1"
```
This command:
- Connects to the production server via SSH
- Navigates to the project directory
- Builds the Docker image using the production Docker Compose configuration
- Uses `--no-cache` to ensure a fresh build
- The build process includes:
  - Installing dependencies
  - Running Next.js build
  - Copying static assets
  - Installing production dependencies (including sharp for image optimization)
  - Setting up proper permissions

### 6. Restart Production Containers
```bash
ssh ploi@5.9.123.208 "cd ~/cvcwebsolutions && docker compose -f docker-compose.prod.yml down && docker compose -f docker-compose.prod.yml up -d"
```
This command:
- Stops and removes the existing containers
- Creates and starts new containers with the updated image
- Runs in detached mode (`-d`) so containers run in the background

## Complete Deployment Command Sequence

```bash
# 1. Check status
git status

# 2. Stage files
git add <files>

# 3. Commit
git commit -m "Your commit message"

# 4. Push
git push

# 5. Build on production
ssh ploi@5.9.123.208 "cd ~/cvcwebsolutions && docker compose -f docker-compose.prod.yml build --no-cache 2>&1"

# 6. Restart containers
ssh ploi@5.9.123.208 "cd ~/cvcwebsolutions && docker compose -f docker-compose.prod.yml down && docker compose -f docker-compose.prod.yml up -d"
```

## Production Environment Details

- **Server IP**: 5.9.123.208
- **SSH User**: ploi
- **Project Directory**: ~/cvcwebsolutions
- **Docker Compose File**: docker-compose.prod.yml
- **Container Name**: cvcwebsolutions-app
- **Network**: cvcwebsolutions_cvc-network

## Important Notes

1. **Git Push Required**: Changes must be pushed to GitHub first, as the production server pulls from the repository during the build process.

2. **Build Time**: The Docker build process typically takes 2-3 minutes, including:
   - npm install (dependency installation)
   - Next.js build (static generation)
   - sharp installation (production image optimization)
   - Permission setup

3. **Zero Downtime**: The deployment process has a brief downtime while containers are being replaced. For zero-downtime deployments, consider using Docker Swarm or Kubernetes in the future.

4. **Environment Variables**: Ensure all required environment variables are set in the production environment on the server.

5. **Database**: The SQLite database is mounted as a volume, so data persists across container restarts.

6. **Static Assets**: Public folder contents (including portfolio screenshots and media) are copied during the build process.

## Troubleshooting

### Check Container Status
```bash
ssh ploi@5.9.123.208 "docker ps"
```

### View Container Logs
```bash
ssh ploi@5.9.123.208 "docker logs cvcwebsolutions-app"
```

### Access Container Shell
```bash
ssh ploi@5.9.123.208 "docker exec -it cvcwebsolutions-app sh"
```

### Rebuild Without Cache
If you encounter caching issues, the `--no-cache` flag is already included in the standard deployment process.

## Future Improvements

1. **CI/CD Pipeline**: Set up GitHub Actions to automate the build and deployment process
2. **Health Checks**: Implement health check endpoints and monitoring
3. **Rollback Strategy**: Maintain previous image versions for quick rollback
4. **Blue-Green Deployment**: Implement zero-downtime deployments
5. **Automated Testing**: Run tests before deployment
