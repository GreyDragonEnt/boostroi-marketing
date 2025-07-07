# BoostROI Agency Marketing Site

## Overview

This is a one-page marketing website for BoostROI Agency, an Australian digital marketing consultancy. The application is built using a full-stack architecture with a React frontend and Express backend, featuring Stripe payment integration, ROI calculation tools, and Calendly scheduling integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Component Library**: Radix UI with shadcn/ui components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Built-in memory storage for development
- **API Design**: RESTful endpoints with JSON responses

### Payment Integration
- **Provider**: Stripe with React Stripe.js components
- **Products**: Three pricing tiers (Starter, Pro, Legendary)
- **Payment Types**: One-time payments and subscriptions
- **Webhook Support**: Stripe webhook handling for payment events

## Key Components

### Database Schema
The application uses two main tables:
- **Users**: Stores user authentication and Stripe customer information
- **ROI Calculations**: Stores marketing ROI calculations with business metrics

### Core Features
1. **Landing Page**: Marketing-focused homepage with hero section, services, case studies
2. **ROI Calculator**: Interactive tool for calculating marketing ROI potential
3. **Pricing System**: Three-tier pricing with Stripe checkout integration
4. **Legal Pages**: Terms of Service, Privacy Policy, and Refund Policy
5. **Calendly Integration**: Modal popup for booking strategy calls

### UI Components
- Responsive design with mobile-first approach
- Accessible components using Radix UI primitives
- Custom brand colors (Orange #FF5B2E, Charcoal #1F2937)
- Interactive elements with hover effects and animations

## Data Flow

1. **User Interaction**: Users interact with the marketing site, use ROI calculator
2. **API Requests**: Frontend makes REST API calls to Express backend
3. **Database Operations**: Drizzle ORM handles PostgreSQL queries
4. **Payment Processing**: Stripe handles checkout sessions and payment processing
5. **External Scheduling**: Calendly widget integration for appointment booking

### ROI Calculator Flow
1. User inputs business metrics (spend, revenue, industry, channels)
2. Frontend validates and submits data to `/api/calc` endpoint
3. Backend calculates projections and stores in database
4. Results displayed with potential improvements and profit calculations

### Payment Flow
1. User selects pricing tier on website
2. Frontend calls `/api/checkout` with product ID
3. Backend creates Stripe checkout session
4. User redirected to Stripe-hosted payment page
5. Webhook processes successful payments

## External Dependencies

### Core Dependencies
- **Database**: `@neondatabase/serverless` for PostgreSQL connection
- **ORM**: `drizzle-orm` for database operations and schema management
- **Payments**: `stripe` SDK for payment processing
- **UI**: `@radix-ui/*` components for accessible UI primitives
- **Forms**: `react-hook-form` with `@hookform/resolvers` for form validation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Tailwind CSS**: Utility-first styling with custom configuration
- **Vite**: Fast development server and build tool
- **ESBuild**: Backend bundling for production deployment

### Third-Party Integrations
- **Stripe**: Payment processing and subscription management
- **Calendly**: Appointment scheduling via embedded widget
- **Unsplash**: Stock images for marketing content

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database Migration**: Drizzle Kit handles schema migrations

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `STRIPE_SECRET_KEY`: Stripe API key (required)
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe public key for frontend
- `NODE_ENV`: Environment mode (development/production)

### Production Setup
- Express server serves static files in production
- Database migrations run via `npm run db:push`
- Stripe webhooks configured for payment processing
- SSL termination handled by hosting platform

## Recent Changes
- July 06, 2025: Initial setup with complete marketing website
- July 06, 2025: PostgreSQL database integration for persistent ROI calculations
- July 06, 2025: Fixed hero section stat overlay positioning to prevent button interference
- July 06, 2025: Fixed Calendly widget integration with multiple booking options
- July 06, 2025: Resolved page scrolling issues caused by fixed element overlays
- July 06, 2025: Resolved RefreshRuntime.register error by removing problematic Replit Vite plugins
- July 06, 2025: Integrated complete social proof suite (client logos, video testimonials, live chat, security badges, team photos)
- July 06, 2025: Added official BoostROI brand logo to header and footer
- July 06, 2025: Website fully functional on external URL (Replit preview tab has display issue but doesn't affect functionality)
- July 07, 2025: Production deployment configuration completed - fixed environment variable loading for production builds
- July 07, 2025: Build process tested and confirmed working - application ready for live deployment
- July 07, 2025: CRITICAL ISSUE IDENTIFIED - Replit environment networking restrictions prevent production Node.js servers from binding to ports
- July 07, 2025: Deployment fails due to fundamental port binding limitations - server works in development but not production mode
- July 07, 2025: Created complete backup and deployment guide for fresh Replit environment setup
- July 07, 2025: All features confirmed working - ready for deployment in new environment

## User Preferences

Preferred communication style: Simple, everyday language.