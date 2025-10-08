# Database Upload Guide

## Quick Upload Method

To upload your local database (with new blog posts, portfolio items, etc.) to production:

```bash
gh workflow run upload-database.yml
```

That's it! The workflow will:
1. Upload `data/payload.db` to the production server
2. Restart the Docker container to apply changes
3. Your changes will be live in ~30 seconds

## Checking Upload Status

```bash
gh run list --workflow=upload-database.yml --limit 1
```

## How It Works

The `.github/workflows/upload-database.yml` workflow:
- Is manually triggered only (workflow_dispatch)
- Uses the same SSH secrets as the deployment workflow
- Uploads the database file via SCP
- Restarts the container to apply changes

## Important Notes

1. **Always commit database changes first**: The workflow uploads the database from the repository
2. **Database is gitignored by default**: Use `git add -f data/payload.db` to force-add it
3. **Backup**: The production database is not automatically backed up before upload (consider adding this if needed)

## When to Use This

- After creating new blog posts locally
- After adding portfolio items
- After making content changes in the local Payload CMS
- Whenever local database has changes that need to go to production

## Alternative: Manual Upload (if workflow fails)

If you need to manually upload via SCP:

```bash
scp -i ~/.ssh/id_rsa_46_4_43_188 data/payload.db ploi@46.4.43.188:/home/ploi/cvcwebsolutions/data/payload.db
ssh -i ~/.ssh/id_rsa_46_4_43_188 ploi@46.4.43.188 "cd /home/ploi/cvcwebsolutions && docker compose -f docker-compose.prod.yml restart"
```

## Troubleshooting

### Workflow fails with "empty archive" error
- Make sure you committed the database file: `git add -f data/payload.db && git commit && git push`

### Permission denied errors on server
- The workflow handles permissions automatically via SSH actions

### Container doesn't restart
- Check logs: `gh run view --log-failed`
- Manually restart: Use the MCP SSH tool or login to server directly
