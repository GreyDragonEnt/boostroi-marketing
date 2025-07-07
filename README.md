# BoostROI Marketing Platform

A comprehensive marketing website for BoostROI agency featuring ROI calculation tools, lead capture, admin management, and integrated payment processing.

## 🚀 Features

- **Professional Marketing Website** - Modern, responsive design with complete brand identity
- **ROI Calculator** - Interactive tool for calculating marketing ROI potential with business projections
- **Lead Management** - Comprehensive lead capture forms and newsletter signup
- **Request Management** - Free ROI audits, case study requests, and weekly marketing requests
- **Admin Dashboard** - Complete admin panel for managing all client requests and leads
- **Payment Integration** - Stripe-powered pricing tiers with subscription management
- **Email Notifications** - SendGrid integration for automated email workflows
- **Database Storage** - PostgreSQL database with Drizzle ORM for persistent data

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** component primitives
- **Framer Motion** for animations
- **TanStack Query** for state management
- **Wouter** for routing

### Backend
- **Express.js** Node.js server
- **Drizzle ORM** with PostgreSQL
- **Stripe** payment processing
- **SendGrid** email service

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)
- SendGrid account (for emails)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/boostroi-marketing.git
   cd boostroi-marketing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/boostroi_db
   SENDGRID_API_KEY=your_sendgrid_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗 Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend application
│   ├── db.ts              # Database configuration
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   └── email.ts           # Email service
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── dist/                   # Production build output
```

## 🔗 API Endpoints

- `GET /health` - Health check
- `POST /api/calc` - ROI calculations
- `POST /api/leads` - Lead capture
- `POST /api/newsletter` - Newsletter signup
- `POST /api/roi-audit` - ROI audit requests
- `POST /api/case-study` - Case study requests
- `POST /api/weekly-marketing` - Weekly marketing requests
- `GET /api/admin/requests` - Admin dashboard data
- `POST /api/checkout` - Stripe checkout sessions

## 🎨 Customization

### Brand Colors
- Primary Orange: `#FF5B2E`
- Charcoal: `#1F2937`
- Light backgrounds and professional styling

### Email Templates
Email templates are configured in `server/email.ts` and use SendGrid's template system.

### Payment Plans
Stripe pricing tiers are configured in the checkout API endpoint with three plans:
- Starter: $997 AUD
- Pro: $1997 AUD  
- Legendary: $3997 AUD

## 📞 Support

For deployment assistance or technical questions, refer to the detailed deployment guides included in the project.

## 📄 License

MIT License - see LICENSE file for details.

---

**Built for BoostROI Agency** - Delivering exceptional marketing ROI for Australian businesses.