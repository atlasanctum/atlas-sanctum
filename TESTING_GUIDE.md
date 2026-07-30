# Testing Guide - Atlas Genesis

Complete guide for testing the platform's features and API endpoints.

## Environment Setup

### Prerequisites
- Node.js 18+
- npm/yarn
- PostgreSQL (or Supabase account)
- cURL or Postman for API testing
- Browser for frontend testing

### Start Development Servers

```bash
# Terminal 1: Frontend
cd atlas-genesis-fe2efd70
npm install
npm run dev
# Runs on http://localhost:8080

# Terminal 2: Backend
cd atlas-genesis-fe2efd70/scaffold-mvp/backend
npm install
PORT=3001 npm run dev
# Runs on http://localhost:3001
```

## 1. API Testing

### Test Health Endpoint
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","timestamp":"2026-01-02T..."}
```

### Test API Info Endpoint
```bash
curl http://localhost:3001/api
# Expected: API endpoint documentation
```

## 2. Authentication Flow Testing

### Step 1: Sign Up a New User
```bash
curl -X POST http://localhost:3001/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!",
    "displayName": "Test User"
  }'
```

**Expected Response (201):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "testuser@example.com",
    "displayName": "Test User",
    "role": "individual"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
USER_ID="550e8400-e29b-41d4-a716-446655440000"
```

### Step 2: Login with Credentials
```bash
curl -X POST http://localhost:3001/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!"
  }'
```

**Expected Response (200):** Same format as signup

### Step 3: Get Current User Profile
```bash
curl -X GET http://localhost:3001/api/v2/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "testuser@example.com",
  "displayName": "Test User",
  "role": "individual"
}
```

### Step 4: Update User Profile
```bash
curl -X PUT http://localhost:3001/api/v2/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "'$USER_ID'",
    "displayName": "Updated Test User",
    "bio": "Testing the platform",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

**Expected Response (200):** Updated user object

## 3. Marketplace Testing

### Step 1: Get Market Statistics
```bash
curl http://localhost:3001/api/v2/marketplace/riums/market
```

**Expected Response:**
```json
{
  "totalRIUs": 24500000,
  "currentPrice": 82.10,
  "highPrice": 95.50,
  "lowPrice": 68.20,
  "tradingVolume": 1840000000,
  "circulationM": 24.5,
  "ytdChange": 19.9
}
```

### Step 2: List Available RIU Offerings
```bash
curl "http://localhost:3001/api/v2/marketplace/riums/listings?page=1&size=10&sortBy=price&order=DESC"
```

**Expected Response:**
```json
{
  "items": [
    {
      "id": "uuid-string",
      "sellerId": "uuid-string",
      "quantity": 1000,
      "price": 82.10,
      "impactScore": 85.5,
      "confidenceInterval": 0.95,
      "status": "active",
      "createdAt": "2026-01-02T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "size": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

### Step 3: Create RIU Listing (Seller)
```bash
# First, create a project (see Projects Testing)
# Then list RIUs

curl -X POST http://localhost:3001/api/v2/marketplace/riums \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "sellerId": "'$USER_ID'",
    "projectId": "project-uuid-from-creation",
    "quantity": 500,
    "price": 85.00,
    "impactScore": 87.5,
    "confidenceInterval": 0.95
  }'
```

**Expected Response (201):**
```json
{
  "id": "listing-uuid",
  "sellerId": "'$USER_ID'",
  "projectId": "project-uuid",
  "quantity": 500,
  "price": 85.00,
  "impactScore": 87.5,
  "confidenceInterval": 0.95,
  "status": "active",
  "createdAt": "2026-01-02T11:00:00Z"
}
```

### Step 4: Purchase RIUs (Buyer)
```bash
# Sign up another user for buyer
BUYER_TOKEN="..."
BUYER_ID="..."

curl -X POST http://localhost:3001/api/v2/marketplace/riums/listing-uuid/purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BUYER_TOKEN" \
  -d '{
    "buyerId": "'$BUYER_ID'",
    "quantity": 100,
    "totalPrice": 8500.00
  }'
```

**Expected Response (201):**
```json
{
  "transaction": {
    "id": "tx-uuid",
    "sellerId": "'$USER_ID'",
    "buyerId": "'$BUYER_ID'",
    "riuId": "listing-uuid",
    "quantity": 100,
    "amount": 8500.00,
    "txType": "purchase",
    "status": "completed",
    "createdAt": "2026-01-02T11:15:00Z"
  },
  "message": "Successfully purchased 100 RIUs"
}
```

### Step 5: Get Bonds
```bash
curl http://localhost:3001/api/v2/marketplace/bonds
```

**Expected Response:**
```json
{
  "items": [],
  "bonds": [
    {
      "type": "5-Year",
      "coupon": 3.8,
      "term": 5,
      "available": 50000000,
      "minPurchase": 1000
    },
    // ... other bonds
  ]
}
```

### Step 6: Get Trading Volume History
```bash
curl http://localhost:3001/api/v2/marketplace/trading-volume
```

### Step 7: Get Transaction History
```bash
curl "http://localhost:3001/api/v2/marketplace/transactions?userId=$USER_ID&page=1" \
  -H "Authorization: Bearer $TOKEN"
```

## 4. Projects Testing

### Step 1: List All Projects
```bash
curl "http://localhost:3001/api/v2/projects?page=1&size=10"
```

**Expected Response:**
```json
{
  "items": [
    {
      "id": "project-uuid",
      "ownerId": "user-uuid",
      "name": "Amazon Restoration",
      "projectType": "regenerative-ag",
      "status": "approved",
      "targetCO2Reduction": 10000,
      "actualCO2Reduction": 5000,
      "biodiversityScore": 85.5,
      "healthImpactScore": 78.2,
      "areaHectares": 5000,
      "createdAt": "2025-12-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "size": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Step 2: Create a New Project
```bash
curl -X POST http://localhost:3001/api/v2/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "ownerId": "'$USER_ID'",
    "name": "Mangrove Forest Restoration",
    "description": "Restoring coastal mangrove ecosystems in Southeast Asia",
    "projectType": "restoration",
    "location": "Indonesia",
    "bioregion": "tropical_coastal",
    "startDate": "2026-02-01",
    "targetCO2Reduction": 5000,
    "areaHectares": 2000,
    "biodiversityScore": 75,
    "healthImpactScore": 80
  }'
```

**Expected Response (201):**
```json
{
  "project": {
    "id": "new-project-uuid",
    "ownerId": "'$USER_ID'",
    "name": "Mangrove Forest Restoration",
    "status": "pending_approval",
    "targetCO2Reduction": 5000,
    "areaHectares": 2000,
    "biodiversityScore": 75,
    "healthImpactScore": 80,
    "createdAt": "2026-01-02T12:00:00Z"
  },
  "message": "Project created successfully"
}
```

**Save Project ID:**
```bash
PROJECT_ID="new-project-uuid"
```

### Step 3: Get Project Details
```bash
curl http://localhost:3001/api/v2/projects/$PROJECT_ID
```

### Step 4: Get Project Statistics
```bash
curl http://localhost:3001/api/v2/projects/$PROJECT_ID/stats
```

### Step 5: Update Project
```bash
curl -X PUT http://localhost:3001/api/v2/projects/$PROJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "active",
    "actualCO2Reduction": 2500,
    "biodiversityScore": 82,
    "healthImpactScore": 85
  }'
```

## 5. Measurements Testing

### Step 1: Record a Measurement
```bash
curl -X POST http://localhost:3001/api/v2/measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "projectId": "'$PROJECT_ID'",
    "measurementDate": "2026-01-02T14:00:00Z",
    "satelliteSource": "Sentinel-2",
    "co2Level": 415,
    "soilCarbonPpm": 46.2,
    "ndviIndex": 0.76,
    "biodiversityScore": 86.0,
    "temperature": 28.5,
    "precipitation": 5.2,
    "confidenceLevel": 0.96,
    "location": {
      "latitude": -3.4653,
      "longitude": -62.2159
    }
  }'
```

**Expected Response (201):**
```json
{
  "measurement": {
    "id": "measurement-uuid",
    "projectId": "'$PROJECT_ID'",
    "measurementDate": "2026-01-02T14:00:00Z",
    "co2Level": 415,
    "soilCarbonPpm": 46.2,
    "ndviIndex": 0.76,
    "biodiversityScore": 86.0,
    "confidenceLevel": 0.96
  },
  "anomalyDetected": false,
  "message": "Measurement recorded successfully"
}
```

### Step 2: Get Project Measurements
```bash
curl "http://localhost:3001/api/v2/measurements/project/$PROJECT_ID?page=1&size=50"
```

### Step 3: Get Measurement Trends
```bash
curl "http://localhost:3001/api/v2/measurements/$PROJECT_ID/trends?days=365"
```

### Step 4: Get Anomalies
```bash
curl "http://localhost:3001/api/v2/measurements/anomalies?projectId=$PROJECT_ID"
```

## 6. Frontend Testing

### Access the Application
1. Open browser: `http://localhost:8080`
2. Navigate to different feature pages
3. Test login/signup flow
4. Browse marketplace
5. View projects and measurements

### Test Navigation
- Click through all navigation links
- Verify all pages load correctly
- Test mobile responsive design
- Check for console errors

### Test Forms
- Signup form validation
- Login form validation
- Project creation form
- Measurement recording form

## 7. Database Testing

### Connect to Database (if using local PostgreSQL)
```bash
# First ensure you have PostgreSQL running
# Then run migrations:

cd scaffold-mvp/backend
npm run migrate
```

### Verify Tables
```bash
# Connect to your database
psql -U postgres -d postgres

# Check tables
\dt

# Query users
SELECT * FROM users;

# Query projects
SELECT * FROM carbon_projects;

# Query measurements
SELECT * FROM measurement_data;
```

## 8. Performance Testing

### Load Testing Frontend
```bash
# Using Apache Bench
ab -n 1000 -c 100 http://localhost:8080

# Using loadtest npm package
npm install -g loadtest
loadtest -n 1000 -c 10 http://localhost:8080
```

### API Load Testing
```bash
# Test marketplace endpoint
ab -n 1000 -c 50 http://localhost:3001/api/v2/marketplace/riums/market

# Test with authentication
# Requires Bearer token in header
```

## 9. Security Testing

### Test Input Validation
```bash
# SQL Injection test (should be prevented)
curl -X POST http://localhost:3001/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin'\''--","password":"anything"}'

# XSS test (should be escaped)
curl -X PUT http://localhost:3001/api/v2/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"userId":"'$USER_ID'","displayName":"<script>alert(1)</script>"}'
```

### Test Authentication
```bash
# Test without token (should fail)
curl http://localhost:3001/api/v2/auth/me

# Test with invalid token
curl http://localhost:3001/api/v2/auth/me \
  -H "Authorization: Bearer invalid-token"

# Test with expired token (should fail after expiry)
```

## 10. Checklist

- [ ] All endpoints respond with correct status codes
- [ ] All required fields are validated
- [ ] Pagination works correctly
- [ ] Authentication tokens work as expected
- [ ] Error messages are clear and helpful
- [ ] Database transactions work correctly
- [ ] Frontend loads without errors
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] Responsive design works on mobile
- [ ] Console has no JavaScript errors
- [ ] API responses have correct JSON format
- [ ] Timestamps are correctly formatted
- [ ] UUIDs are valid format
- [ ] Database constraints are enforced

## Troubleshooting

### Backend Won't Start
```bash
# Check if port is in use
lsof -ti :3001

# Kill process on port
kill -9 <PID>

# Try different port
PORT=3002 npm run dev
```

### Database Connection Error
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### Frontend Won't Load
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# Dev tools > Application > Clear storage
```

---

**Last Updated:** January 2, 2026
**Status:** Production Ready
