# 🚀 Atlas Genesis - Full Stack Setup Guide

Complete guide to setting up and running the Atlas Genesis platform locally.

## Prerequisites

- **Node.js** 18+ and npm/yarn
- **PostgreSQL** 14+ (or Supabase account)
- **Git**

## Quick Start

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd scaffold-mvp/backend
npm install
cd ../..
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Frontend
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# Backend (create scaffold-mvp/backend/.env)
DATABASE_URL=postgresql://user:password@localhost:5432/atlas_genesis
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
NODE_ENV=development
```

### 3. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key to `.env`
3. Run migrations from `supabase/migrations/` in Supabase SQL editor

#### Option B: Local PostgreSQL

```bash
# Create database
createdb atlas_genesis

# Run migrations
cd scaffold-mvp/backend
npm run migrate
```

### 4. Start Development Servers

#### Terminal 1: Frontend
```bash
npm run dev
```
Frontend runs on http://localhost:8080

#### Terminal 2: Backend
```bash
cd scaffold-mvp/backend
npm run dev
```
Backend runs on http://localhost:3001

### 5. Verify Setup

1. **Frontend**: Open http://localhost:8080
2. **Backend Health**: Open http://localhost:3001/health
3. **API Docs**: Open http://localhost:3001/api

## Project Structure

```
atlas-genesis-fe2efd70/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & API client
│   └── integrations/       # Third-party integrations
│
├── scaffold-mvp/
│   └── backend/            # Express.js API server
│       ├── src/
│       │   ├── routes/     # API route handlers
│       │   ├── services/  # Business logic
│       │   └── middleware/ # Express middleware
│       └── package.json
│
├── supabase/
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge functions
│
└── public/                 # Static assets
```

## API Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### API Documentation
```bash
curl http://localhost:3001/api
```

### Example: Sign Up
```bash
curl -X POST http://localhost:3001/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123",
    "displayName": "John Doe"
  }'
```

## Troubleshooting

### Frontend won't connect to backend

1. Check `VITE_API_URL` in `.env` matches backend port
2. Verify backend is running on port 3001
3. Check browser console for CORS errors
4. Ensure backend CORS is configured correctly

### Database connection errors

1. Verify `DATABASE_URL` is correct
2. Check PostgreSQL is running
3. Ensure database exists
4. Verify migrations have been run

### Port already in use

```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

## Development Workflow

1. **Make changes** to frontend or backend code
2. **Hot reload** will automatically refresh
3. **Test API** using curl or Postman
4. **Check logs** in terminal for errors

## Next Steps

- Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production setup
- Review [FULL_STACK_ENGINEERING_REVIEW.md](./FULL_STACK_ENGINEERING_REVIEW.md) for architecture

## Need Help?

- Check existing documentation files
- Review error messages in browser console
- Check backend logs in terminal
- Verify environment variables are set correctly

