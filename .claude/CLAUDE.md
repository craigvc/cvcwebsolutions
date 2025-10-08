# CVC Web Solutions - Project Instructions for Claude

## Database Management

### Uploading Database to Production

**Quick Method (Preferred):**
```bash
gh workflow run upload-database.yml
```

This workflow automatically:
1. Uploads `data/payload.db` to production server
2. Restarts the Docker container
3. Makes changes live in ~30 seconds

**Before uploading:**
- Commit the database file: `git add -f data/payload.db && git commit -m "Update database" && git push`
- The database is in `.gitignore` so use `-f` to force-add it

**Check upload status:**
```bash
gh run list --workflow=upload-database.yml --limit 1
```

**Full documentation:** See `DATABASE-UPLOAD-GUIDE.md` in project root

## Important Notes

- Database file: `data/payload.db`
- Database is gitignored by default
- Production server: `ploi@46.4.43.188` at `/home/ploi/cvcwebsolutions`
- Always upload database after creating content locally (blog posts, portfolio items, etc.)

## Deployment

The main deployment workflow automatically:
- Builds Docker image in GitHub Actions
- Pulls pre-built image on production server
- Deploys to https://cvcwebsolutions.com

**Note:** Deployment does NOT upload the database. Use the database upload workflow separately.
