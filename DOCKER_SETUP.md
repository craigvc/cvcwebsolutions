# Docker Setup for CVC New Site

## Prerequisites
- Docker Desktop installed
- OpenSSL installed (for generating SSL certificates)

## Setup Instructions

### 1. Generate SSL Certificates

Run the appropriate script for your OS:

**Windows:**
```bash
generate-ssl.bat
```

**Linux/Mac:**
```bash
chmod +x generate-ssl.sh
./generate-ssl.sh
```

### 2. Add Domain to Hosts File

Add the following line to your hosts file:

**Windows (C:\Windows\System32\drivers\etc\hosts):**
```
127.0.0.1 cvcnew.com
127.0.0.1 www.cvcnew.com
```

**Linux/Mac (/etc/hosts):**
```
127.0.0.1 cvcnew.com
127.0.0.1 www.cvcnew.com
```

### 3. Update Next.js Configuration

Ensure your `next.config.js` has standalone output enabled:

```javascript
module.exports = {
  output: 'standalone',
  // ... other config
}
```

### 4. Build and Run

```bash
# Build and start the containers
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 5. Access the Site

Once running, access the site at:
- https://cvcnew.com

**Note:** Your browser will show a security warning because we're using self-signed certificates. This is normal for local development. Click "Advanced" and "Proceed to cvcnew.com" to continue.

## Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f nginx

# Rebuild after code changes
docker-compose up --build

# Clean up everything (including volumes)
docker-compose down -v
```

## Troubleshooting

### Port Already in Use
If port 443 or 80 is already in use, stop the conflicting service or modify the ports in `docker-compose.yml`.

### SSL Certificate Issues
Regenerate certificates using the provided scripts.

### Container Not Starting
Check logs with `docker-compose logs` to identify the issue.

### Permission Issues (Linux/Mac)
Ensure the SSL certificates have proper permissions:
```bash
chmod 644 nginx/ssl/cvcnew.crt
chmod 600 nginx/ssl/cvcnew.key
```

## Production Deployment

For production:
1. Use real SSL certificates (Let's Encrypt recommended)
2. Update environment variables in `.env` file
3. Consider using Docker Swarm or Kubernetes for orchestration
4. Implement proper logging and monitoring