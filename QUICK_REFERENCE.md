# 🚀 Atlas Genesis - Quick Reference Card

## ⚡ Quick Start (30 seconds)

```bash
cd atlas-genesis-fe2efd70
./start.sh              # macOS/Linux
# or
start.bat              # Windows
```

Then open: **http://localhost:8080**

---

## 📍 URLs & Endpoints

| URL | Purpose |
|-----|---------|
| http://localhost:8080 | Frontend (React app) |
| http://localhost:3001 | Backend API |
| http://localhost:3001/api | API documentation |
| http://localhost:3001/health | Server health |

---

## 🗺️ 10 Feature Pages

| # | Feature | URL | Purpose |
|---|---------|-----|---------|
| 1 | Measurements | `/measurements` | Satellite monitoring |
| 2 | Bioregions | `/bioregions` | Geographic mapping |
| 3 | Agriculture | `/regenerative-agriculture` | Ecosystem tracking |
| 4 | Valuation | `/valuation` | Credit pricing |
| 5 | Governance | `/governance` | Community voting |
| 6 | Marketplace | `/marketplace` | RIU trading |
| 7 | Health | `/health` | Health integration |
| 8 | Outreach | `/outreach` | Education & stories |
| 9 | Security | `/security` | Fraud detection |
| 10 | Adoption | `/adoption` | Entry pathways |

---

## 🔌 Key API Endpoints

### Authentication
```bash
POST   /api/v2/auth/signup           # Register user
POST   /api/v2/auth/login            # Login
GET    /api/v2/auth/me               # Current user
```

### Marketplace
```bash
GET    /api/v2/marketplace/riums/market         # Market stats
GET    /api/v2/marketplace/riums/listings      # List RIUs
POST   /api/v2/marketplace/riums/{id}/purchase # Buy RIUs
```

### Projects
```bash
GET    /api/v2/projects              # List projects
POST   /api/v2/projects              # Create project
GET    /api/v2/projects/{id}         # Get project
```

### Measurements
```bash
GET    /api/v2/measurements/project/{id}   # Get measurements
POST   /api/v2/measurements               # Record measurement
```

---

## 🔐 Authentication

### Sign Up
```bash
curl -X POST http://localhost:3001/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123",
    "displayName": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123"}'
```

### Use Token
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:3001/api/v2/auth/me
```

---

## 📚 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| GETTING_STARTED.md | Quick orientation | 5-10 min |
| README.md | Full overview | 10 min |
| API_DOCUMENTATION.md | 40+ endpoints | 30 min |
| TESTING_GUIDE.md | How to test | 15 min |
| DEPLOYMENT_GUIDE.md | How to deploy | 30 min |
| COMPLETION_STATUS.md | What's done | 15 min |
| DOCUMENTATION_INDEX.md | Navigation guide | 5 min |

---

## 🧪 Quick Tests

### Test Frontend
```bash
curl http://localhost:8080
```

### Test Backend Health
```bash
curl http://localhost:3001/health
```

### Test API
```bash
curl http://localhost:3001/api
```

### Sign Up Test User
```bash
curl -X POST http://localhost:3001/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 📁 File Structure

```
src/
├── pages/          # 10 feature pages
├── components/     # 60+ React components
├── hooks/          # 25+ custom hooks
└── lib/api/        # API service (40+ methods)

scaffold-mvp/backend/src/
└── routes/         # 40+ API endpoints

docs/
├── API_DOCUMENTATION.md
├── DEPLOYMENT_GUIDE.md
└── ...

.env.example        # Environment template
start.sh            # Unix startup script
start.bat           # Windows startup script
```

---

## 🛠️ Common Commands

### Development
```bash
npm install         # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
```

### Backend
```bash
cd scaffold-mvp/backend
npm install
PORT=3001 npm run dev
```

### Troubleshooting
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install

# Kill process on port 8080
lsof -i :8080
kill -9 <PID>
```

---

## 🚀 Deployment Checklist

- [ ] Read DEPLOYMENT_GUIDE.md
- [ ] Create .env.production
- [ ] Set up production database
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Deploy backend (AWS/Heroku)
- [ ] Configure domain
- [ ] Enable HTTPS
- [ ] Set up monitoring

---

## 📊 Key Statistics

- **Frontend Components:** 60+
- **API Endpoints:** 40+
- **Database Tables:** 15+
- **React Hooks:** 25+
- **Lines of Code:** 8,000+
- **Documentation Lines:** 3,000+
- **Build Time:** 3-4 seconds
- **Bundle Size:** 1.6 MB (431 KB gzipped)

---

## 🎯 Tech Stack Summary

**Frontend:** React 18.3 + TypeScript + Tailwind CSS + React Query  
**Backend:** Express.js + Node.js + PostgreSQL + PostGIS  
**Database:** PostgreSQL 14+ with PostGIS, Supabase compatible  
**Deployment:** Vercel (frontend), AWS/Heroku (backend)  

---

## ✅ What's Ready

✅ 10 fully-implemented feature pages  
✅ 40+ REST API endpoints  
✅ Complete database schema  
✅ API service layer  
✅ React Query hooks  
✅ JWT authentication  
✅ TypeScript throughout  
✅ Comprehensive documentation  
✅ Production-ready code  
✅ Zero build errors  

---

## 🎓 Next Steps

1. **Start:** Run `./start.sh`
2. **Explore:** Visit all 10 pages at http://localhost:8080
3. **Test:** Follow TESTING_GUIDE.md
4. **Learn:** Read API_DOCUMENTATION.md
5. **Deploy:** Follow DEPLOYMENT_GUIDE.md

---

## ❓ Help

| Question | Answer |
|----------|--------|
| How do I start? | Run `./start.sh` or read GETTING_STARTED.md |
| Where's the API docs? | API_DOCUMENTATION.md |
| How do I test? | TESTING_GUIDE.md |
| How do I deploy? | DEPLOYMENT_GUIDE.md |
| What's been built? | COMPLETION_STATUS.md |
| How do I navigate docs? | DOCUMENTATION_INDEX.md |

---

## 🌍 Atlas Genesis - Production Ready Platform

**Version:** 2.0.0  
**Status:** ✅ COMPLETE  
**Build Time:** ~3-4 seconds  
**Bundle Size:** 1.6 MB  

Building a regenerative future, one credit at a time. 🌱💚

---

**Print this card or bookmark it for quick reference!**
