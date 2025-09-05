# System Patterns: CVC Web Solutions

## Architecture Overview
The system follows a monolithic Next.js application pattern with clear separation between public website and admin functionality.

## Key Technical Decisions

### Application Structure
- **Next.js App Router**: Using src/app/ directory structure for routing
- **Component Organization**: Centralized components in src/components/ with feature-based grouping
- **API Layer**: RESTful API routes under src/app/api/ for backend functionality
- **Database**: SQLite for simplicity and file-based storage (data/content.db)

### Routing Patterns
```
/                    # Public homepage
/services/*          # Service pages (web-dev, AI, design, etc.)
/portfolio/*         # Portfolio showcase
/blog/*              # Content marketing blog
/schedule            # Public appointment booking
/admin/*             # Protected admin dashboard
/api/*               # Backend API endpoints
```

### Component Architecture
- **Layout Components**: Header, Footer for consistent structure
- **Page Components**: Hero, CTA, Features for marketing pages
- **Feature Components**: Organized by domain (home/, admin functionality)
- **Shared Components**: Toast, CookieConsent for reusable UI elements

### Data Flow Patterns
1. **Client Actions** → Next.js API Routes → Database/External APIs
2. **Admin Dashboard** → Protected routes with authentication
3. **Public Forms** → API endpoints → Integration services (Calendar, Email)

## Design Patterns in Use

### Authentication & Authorization
- Custom auth system in src/lib/auth.ts
- Protected admin routes with middleware/layout pattern
- Session-based authentication for admin access

### Integration Pattern
- Service abstraction in src/lib/ for external APIs:
  - google-calendar.ts for appointment scheduling
  - zoom.ts for meeting management
  - email.ts for notifications
  - fossbilling.ts for payment processing

### Database Abstraction
- SQLite wrapper in src/lib/db-sqlite.ts
- Direct SQL queries for simplicity
- File-based database storage in data/ directory

### Content Management
- Blog content system with enhanced features
- Portfolio management with screenshot capture
- Dynamic content rendering from database

## Component Relationships

### Public Website Flow
```
Layout (Header/Footer) 
├── Home Page (Hero, Services, Portfolio, CTA)
├── Service Pages (Individual service descriptions)
├── Portfolio Pages (Project showcases)
├── Blog System (Content marketing)
└── Booking System (Schedule appointments)
```

### Admin Dashboard Flow
```
Admin Layout
├── Dashboard (Analytics, overview)
├── Appointments (Calendar integration)
├── Portfolio Management (Project CRUD)
├── Blog Management (Content CRUD)
├── Settings (Configuration)
└── Screenshot Tool (Project documentation)
```

## Critical Implementation Paths

### Appointment Booking Flow
1. Client visits /schedule page
2. Calendar integration shows availability
3. Booking creates database record
4. Google Calendar event created automatically
5. Zoom meeting generated for appointment
6. Email notifications sent to both parties

### Portfolio Management Flow
1. Admin uploads project details
2. Screenshot system captures project images
3. Images stored in public/screenshots/
4. Database records project metadata
5. Public portfolio page displays projects dynamically

### Content Management Flow
1. Blog posts stored in database with metadata
2. Dynamic routing serves individual posts
3. Enhanced blog system with categorization
4. SEO optimization for content pages

## Infrastructure Patterns

### Docker Deployment
- Multi-stage build process (dev, prod, cvclocal environments)
- Nginx reverse proxy configuration
- SSL certificate management
- Environment-specific configurations

### File Organization
- Environment-specific Docker configs
- SSL certificates in nginx/ssl/
- Database files in data/ directory
- Public assets in public/ with screenshot management
- Configuration files at root level

### Security Patterns
- SSL/TLS termination at Nginx
- Environment variable management for secrets
- Protected admin routes
- Input validation and sanitization

## Development Workflow
- TypeScript for type safety
- Tailwind CSS for styling consistency
- Component-based architecture for maintainability
- API-first approach for data operations
