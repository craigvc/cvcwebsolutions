# Port Management Strategy

## Current Status
- **Port 3000**: Next.js Development Server (Primary Application)
  - Process: node.exe (PID: 50052)
  - Status: ACTIVE and LISTENING
  - Memory Usage: ~1.2GB

## Port Usage Guidelines

### Primary Ports
- **3000**: Main Next.js application (Always use this)
- **11434**: Ollama API (Local AI model server)
- **5432**: PostgreSQL Database (if using local DB)

### Management Commands

#### Check Port Usage
```bash
# Windows
netstat -ano | findstr :3000

# Get process details
tasklist | findstr [PID]
```

#### Kill Existing Processes
```bash
# Windows - Kill by PID
taskkill /PID [process_id] /F

# Kill all Node processes (use with caution)
taskkill /IM node.exe /F
```

#### Restart Development Server
```bash
# First kill existing process if needed
taskkill /PID 50052 /F

# Then restart
npm run dev
```

## Best Practices

1. **Always use port 3000** for the main application
2. **Check for existing processes** before starting new ones
3. **Kill zombie processes** that might be hanging
4. **Monitor memory usage** - restart if > 2GB

## Common Issues & Solutions

### Port Already in Use
```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID [found_pid] /F
```

### Multiple Node Processes
- Only one should be running for the dev server
- Kill duplicates to free memory

### Memory Leaks
- If memory usage exceeds 2GB, restart the server
- Current healthy usage: ~1.2GB

## Quick Reference
- Development URL: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Portfolio Editor: http://localhost:3000/admin/portfolio
- Pages Editor: http://localhost:3000/admin/pages

## Monitoring Script
To continuously monitor port 3000:
```bash
# Create a batch file: monitor-port.bat
@echo off
:loop
cls
echo Monitoring Port 3000...
netstat -ano | findstr :3000
timeout /t 5 > nul
goto loop
```

## Notes
- The current Node.js process (50052) is working correctly
- No action needed unless experiencing issues
- All AI tools are now configured to use local services (Ollama + Puppeteer)
