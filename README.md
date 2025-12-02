# Kolaq Alagbo E-Commerce Platform

A full-stack e-commerce platform built for the Nigerian market, featuring product management, order processing, logistics integration, and comprehensive admin dashboard.

## Features

- **Product Management**: Full product catalog with variants, inventory tracking
- **Order Processing**: Complete checkout flow with order tracking
- **User Authentication**: Secure JWT-based authentication with role-based access
- **Admin Dashboard**: Comprehensive analytics and management tools
- **Logistics Integration**: Support for Nigerian shipping providers
- **Email Notifications**: Automated order and shipment notifications
- **Payment Integration**: Ready for Paystack integration
- **SEO Optimized**: Built-in SEO support for better visibility

## Tech Stack

### Backend
- NestJS (Node.js framework)
- PostgreSQL with Prisma ORM
- JWT Authentication
- Bull Queue for background jobs
- Redis for caching

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Recharts for analytics

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis server (optional, for background jobs)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd kolaq-alagbo-project
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Configure environment variables

Backend (.env):
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASS="your-password"
FRONTEND_URL="http://localhost:3000"
```

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

5. Run database migrations
```bash
cd backend
npx prisma migrate deploy
```

6. Start the development servers

Backend:
```bash
cd backend
npm run start:dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Deployment

### Backend (Railway/Render)
- Configure DATABASE_URL and environment variables
- Deploy using provided Dockerfile

### Frontend (Netlify)
- Connect your repository
- Set build command: `npm run build`
- Set publish directory: `.next`

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   ├── common/       # Shared utilities
│   │   └── main.ts
│   ├── prisma/           # Database schema
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/          # Next.js pages
    │   ├── components/   # React components
    │   ├── lib/          # Utilities
    │   └── types/        # TypeScript types
    └── package.json
```

## License

Private - All rights reserved
