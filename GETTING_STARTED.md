# 🚀 Getting Started with Atlas Genesis

Welcome to Atlas Genesis! This guide will help you get the platform up and running in just a few minutes.

---

## ⚡ Quick Start (5 minutes)

### 1. **Start with the Startup Script** (Recommended)

The easiest way to get everything running:

**macOS/Linux:**
```bash
cd atlas-genesis-fe2efd70
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
cd atlas-genesis-fe2efd70
start.bat
```

This will:
- ✅ Install dependencies for frontend and backend
- ✅ Start frontend server (http://localhost:8080)
- ✅ Start backend API (http://localhost:3001)
- ✅ Display API documentation

### 2. **Open the Platform**

Once both servers are running:
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3001/api

You should see the Atlas Genesis homepage with navigation to all 10 features.

---

## 🔧 Manual Setup (if scripts don't work)

### Terminal 1: Start Frontend

```bash
# Navigate to project root
cd atlas-genesis-fe2efd70

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will open on http://localhost:8080
```

### Terminal 2: Start Backend

```bash
# Navigate to backend
cd atlas-genesis-fe2efd70/scaffold-mvp/backend

# Install dependencies
npm install

# Start backend server
PORT=3001 npm run dev

# Backend API running on http://localhost:3001
```

---

## 📍 Main URLs

| Component | URL | Purpose |
|-----------|-----|---------|
| **Frontend** | http://localhost:8080 | Main platform UI |
| **Backend API** | http://localhost:3001/api | API documentation |
| **Health Check** | http://localhost:3001/health | Server status |

---

## 🗺️ Platform Navigation

### Main Features (10 Pages)

1. **Measurements** (`/measurements`)
   - Satellite data, anomaly detection
   - Real-time monitoring dashboard
   - Historical data trends

2. **Bioregions** (`/bioregions`)
   - Geographic zones mapping
   - Climate risk forecasting
   - Indigenous land recognition

3. **Regenerative Agriculture** (`/regenerative-agriculture`)
   - Soil microbiome scoring
   - Crop diversity tracking
   - Ecosystem restoration metrics

4. **Valuation** (`/valuation`)
   - Credit pricing model
   - Confidence intervals
   - Impact scoring algorithm

5. **Governance** (`/governance`)
   - Ethics council membership
   - Voting on proposals
   - Community consent

6. **Marketplace** (`/marketplace`)
   - Buy/sell RIUs
   - Bond offerings
   - Trading history

7. **Health** (`/health`)
   - Air quality metrics
   - Water restoration
   - Health benefits

8. **Outreach** (`/outreach`)
   - Multilingual content
   - Educational resources
   - Community stories

9. **Security** (`/security`)
   - Fraud detection
   - Audit trails
   - Data integrity

10. **Adoption** (`/adoption`)
    - Getting started guide
    - Role-specific pathways
    - Impact projections

---

## 🔐 Authentication

### Create an Account

1. Navigate to frontend: http://localhost:8080
2. Click **"Sign Up"** or **"Get Started"**
3. Enter your email and password
4. Confirm email (or skip in development)
5. You're logged in! ✅

### API Authentication

For API calls, you need a JWT token:

```bash
# Sign up
curl -X POST http://localhost:3001/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123",
    "displayName": "John Doe"
  }'

# Response includes token:
# {
#   "token": "eyJhbGciOiJIUzI1NiIs...",
#   "userId": "550e8400-e29b-41d4-a716-446655440000"
# }

# Use token in requests
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:3001/api/v2/auth/me
```

---

## 📚 API Endpoints

### Quick Reference

**Authentication:**
- `POST /api/v2/auth/signup` - Register
- `POST /api/v2/auth/login` - Login
- `GET /api/v2/auth/me` - Current user

**Marketplace:**
- `GET /api/v2/marketplace/riums/market` - Market stats
- `GET /api/v2/marketplace/riums/listings` - RIU listings
- `POST /api/v2/marketplace/riums/{id}/purchase` - Buy RIUs

**Projects:**
- `GET /api/v2/projects` - List projects
- `POST /api/v2/projects` - Create project

**Measurements:**
- `GET /api/v2/measurements/project/{id}` - Get measurements
- `POST /api/v2/measurements` - Record measurement

For complete API documentation: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🧪 Quick Tests

### 1. Test Frontend is Running
```bash
curl http://localhost:8080
# Should return HTML (frontend page)
```

### 2. Test Backend is Running
```bash
curl http://localhost:3001/health
# Response: {"status":"ok"}
```

### 3. Test API Documentation
```bash
curl http://localhost:3001/api
# Shows all available endpoints
```

### 4. Sign Up Test User
```bash
curl -X POST http://localhost:3001/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

More comprehensive testing: [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🛠️ Development Tasks

### Build Frontend
```bash
npm run build
# Creates optimized dist/ folder for deployment
```

### Build Backend
```bash
cd scaffold-mvp/backend
npm run build
# Compiles TypeScript to JavaScript
```

### Run TypeScript Checks
```bash
npm run type-check
```

### Format Code
```bash
npm run format
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| [README.md](README.md) | Full project overview |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Production deployment |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Testing procedures |
| [PLATFORM_COMPLETION_SUMMARY.md](PLATFORM_COMPLETION_SUMMARY.md) | Project completion report |
| [.env.example](.env.example) | Environment variables template |

---

## 🚨 Troubleshooting

### Port Already in Use

If you get "Port 8080 is already in use":
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Dependencies Install Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Connection Issues

```bash
# Make sure you have PostgreSQL running
# Check connection string in backend/src/db.ts

# Or use Supabase (cloud PostgreSQL)
# Update DB_URL in environment variables
```

### TypeScript Errors

```bash
# Sometimes TypeScript cache gets stale
npm run clean
npm install
npm run build
```

---

## 📖 Next Steps

1. **Explore the Features**
   - Visit each of the 10 feature pages
   - Interact with the dashboards
   - Check out data visualizations

2. **Test the API**
   - Use [TESTING_GUIDE.md](TESTING_GUIDE.md) for step-by-step API tests
   - Try creating projects, recording measurements
   - Test marketplace transactions

3. **Review the Code**
   - Check out API implementations in `scaffold-mvp/backend/src/routes/`
   - Look at React components in `src/components/`
   - Review data models in database migrations

4. **Deploy to Production**
   - Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
   - Set up Vercel for frontend
   - Set up AWS/Heroku for backend

5. **Customize & Extend**
   - Add new features
   - Integrate additional data sources
   - Enhance visualizations

---

## 💡 Tips & Best Practices

### Development
- **Use TypeScript** - Get better IDE support and catch errors early
- **Check build before committing** - Run `npm run build` to verify
- **Review API docs** - Always check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for available endpoints
- **Test locally first** - Use curl or Postman to test APIs before frontend integration

### Debugging
- **Check browser console** - Look for JavaScript errors (F12)
- **Check backend logs** - Terminal output shows API request details
- **Use DevTools** - Network tab shows API request/response
- **Enable debug logging** - See backend requests in detail

### Performance
- **Build is slow?** - Try clearing cache: `npm run clean && npm install`
- **Frontend rendering slow?** - Check React DevTools for rerenders
- **API slow?** - Check database query performance
- **Bundle size too large?** - Review what's being imported

---

## 🔗 External Resources

- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **TypeScript:** https://www.typescriptlang.org
- **Express.js:** https://expressjs.com
- **PostgreSQL:** https://www.postgresql.org
- **PostGIS:** https://postgis.net
- **Supabase:** https://supabase.com

---

## ❓ Common Questions

**Q: Do I need to have PostgreSQL installed locally?**
A: No, you can use Supabase (cloud PostgreSQL). Update the `DB_URL` in your environment variables.

**Q: Can I modify the 10 feature pages?**
A: Yes! All code is fully customizable. Edit files in `src/pages/` and `src/components/`.

**Q: How do I add a new API endpoint?**
A: Create a new route in `scaffold-mvp/backend/src/routes/`, import it in `index.ts`.

**Q: Where do I deploy this?**
A: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for Vercel, Netlify, AWS, and Heroku instructions.

**Q: How do I handle payments?**
A: Paystack and PayPal webhooks are configured in `supabase/functions/`. Add API keys to environment variables.

---

## 📞 Support

- **Issues?** Check [TESTING_GUIDE.md](TESTING_GUIDE.md) for troubleshooting
- **API Questions?** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Deployment Issues?** Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Feature Overview?** Read [README.md](README.md)

---

## ✅ Ready? Let's Go!

```bash
# macOS/Linux
./start.sh

# Windows
start.bat

# Open browser
# http://localhost:8080
```

**Welcome to Atlas Genesis! 🌍💚**

---

**Version:** 2.0.0  
**Last Updated:** January 2, 2026  
**Status:** ✅ Production Ready
