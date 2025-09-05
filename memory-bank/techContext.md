# Technical Context: CVC Web Solutions

## Technology Stack

### Frontend Framework
- **Next.js 13+**: React-based framework with App Router
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Components**: Component-based architecture

### Backend & API
- **Next.js API Routes**: Server-side functionality
- **Node.js Runtime**: JavaScript runtime environment
- **RESTful API Design**: Standard HTTP methods and responses

### Database & Storage
- **SQLite**: File-based relational database
- **File System**: Image and document storage in public/ directory
- **Database Location**: `data/content.db`

### External Integrations
- **Google Calendar API**: Appointment scheduling and availability
- **Zoom API**: Meeting creation and management
- **Email Services**: Notification and communication system
- **FOSSBilling**: Payment processing integration

### Infrastructure & Deployment
- **Docker**: Containerized application deployment
- **Nginx**: Reverse proxy and SSL termination
- **SSL/TLS**: Security certificates for HTTPS
- **Multi-environment**: Development, production, and local configurations

## Development Setup

### Configuration Files
- `next.config.js`: Next.js configuration
- `tailwind.config.js`: Tailwind CSS setup
- `postcss.config.mjs`: PostCSS configuration
- `tsconfig.json`: TypeScript compiler options
- `package.json`: Project dependencies and scripts

### Environment Setup
- Node.js environment required
- Package manager: npm (evidenced by package-lock.json)
- Development vs Production configurations
- Environment variables for API keys and secrets

## Docker Development
- Multi-stage builds for different environments
- `docker-compose.yml`: Standard composition
- `docker-compose.local.yml`: Local development
- `docker-compose.cvclocal.yml`: CVC-specific local setup

## File Organization Patterns
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components  
├── lib/                # Utility functions and integrations
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── content/            # Content management
