# Sanity Research Notes

## Key Findings about Sanity Data Storage

After research, it's confirmed that:
- **Sanity Studio** (the UI/editor) = Open source
- **Sanity Content Lake** (data storage) = Cloud service only

Sanity does NOT offer a self-hosted backend option. All data must be stored in their cloud infrastructure, even when using the open-source Studio.

## Documentation References
- Searched for self-hosted options: Returns 404
- Content Lake documentation confirms cloud-only storage
- No local storage option available

## Decision
Since the user wants a fully self-hosted solution and Sanity requires cloud storage, we need to pivot to a different solution.

## Alternative Options for Self-Hosted Blog
1. **SQLite Database** - Consistent with portfolio, fully local
2. **Markdown/MDX Files** - Version controlled, no external dependencies
3. **Directus** - Self-hosted headless CMS
4. **Strapi** - Self-hosted headless CMS

Recommendation: Use SQLite for consistency with existing portfolio setup.
