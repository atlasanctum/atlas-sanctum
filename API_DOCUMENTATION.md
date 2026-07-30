# API Documentation - Atlas Genesis

## Overview
The Atlas Genesis API provides complete access to the Regenerative Carbon Credit Marketplace platform. The API uses RESTful principles with JSON request/response formats.

## Base URLs
- **Development**: `http://localhost:3001/api`
- **V2 API**: `http://localhost:3001/api/v2` (Recommended)
- **Production**: `https://api.atlas-genesis.com/api`

## Authentication

### JWT Bearer Token
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGc...
```

### Getting a Token
1. Sign up or login to get a token
2. Store the token in localStorage
3. Include it in all subsequent API requests

## HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Server Error

## Response Format
All responses are JSON with the following structure:
```json
{
  "data": {...},
  "error": "error message (if applicable)",
  "code": "error_code (if applicable)"
}
```

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/api/v2/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password_123",
  "displayName": "John Doe",
  "role": "individual" // optional: individual, farmer, corporate, government
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "individual"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123",
    "displayName": "John Doe"
  }'
```

### 2. Login
**POST** `/api/v2/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "individual"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get Current User
**GET** `/api/v2/auth/me`

Get the authenticated user's profile.

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "displayName": "John Doe",
  "role": "individual"
}
```

### 4. Update Profile
**PUT** `/api/v2/auth/profile`

Update user profile information.

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "userId": "uuid-string",
  "displayName": "Jane Doe",
  "bio": "Environmental advocate",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

## Marketplace Endpoints

### 1. Get Market Statistics
**GET** `/api/v2/marketplace/riums/market`

Get real-time RIU market data.

**Response (200):**
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

### 2. List RIU Offerings
**GET** `/api/v2/marketplace/riums/listings`

Get available RIU listings for purchase.

**Query Parameters:**
- `page` - Page number (default: 1)
- `size` - Items per page (default: 20)
- `sortBy` - Sort field: `price`, `quantity`, `created_at` (default: `price`)
- `order` - `ASC` or `DESC` (default: `DESC`)

**Response (200):**
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
    "size": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 3. Create RIU Listing
**POST** `/api/v2/marketplace/riums`

List RIUs for sale in the marketplace.

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "sellerId": "uuid-string",
  "projectId": "uuid-string",
  "quantity": 1000,
  "price": 85.00,
  "impactScore": 87.5,
  "confidenceInterval": 0.95
}
```

**Response (201):**
```json
{
  "id": "uuid-string",
  "sellerId": "uuid-string",
  "projectId": "uuid-string",
  "quantity": 1000,
  "price": 85.00,
  "impactScore": 87.5,
  "confidenceInterval": 0.95,
  "status": "active",
  "createdAt": "2026-01-02T10:30:00Z"
}
```

### 4. Purchase RIUs
**POST** `/api/v2/marketplace/riums/{id}/purchase`

Purchase RIUs from a listing.

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "buyerId": "uuid-string",
  "quantity": 500,
  "totalPrice": 41050.00
}
```

**Response (201):**
```json
{
  "transaction": {
    "id": "uuid-string",
    "sellerId": "uuid-string",
    "buyerId": "uuid-string",
    "riuId": "uuid-string",
    "quantity": 500,
    "amount": 41050.00,
    "txType": "purchase",
    "status": "completed",
    "createdAt": "2026-01-02T10:45:00Z"
  },
  "message": "Successfully purchased 500 RIUs"
}
```

### 5. Get Bonds
**GET** `/api/v2/marketplace/bonds`

Get available bond offerings.

**Response (200):**
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
    {
      "type": "10-Year",
      "coupon": 5.2,
      "term": 10,
      "available": 30000000,
      "minPurchase": 5000
    },
    {
      "type": "Perpetual",
      "coupon": 6.5,
      "term": 0,
      "available": 20000000,
      "minPurchase": 25000
    },
    {
      "type": "Green Impact",
      "coupon": 4.5,
      "term": 7,
      "available": 15000000,
      "minPurchase": 10000
    }
  ]
}
```

### 6. Purchase Bond
**POST** `/api/v2/marketplace/bonds/{id}/purchase`

Purchase a bond offering.

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "buyerId": "uuid-string",
  "amount": 50000
}
```

**Response (201):**
```json
{
  "purchase": {
    "id": "uuid-string",
    "bondId": "uuid-string",
    "buyerId": "uuid-string",
    "amount": 50000,
    "purchaseDate": "2026-01-02T10:50:00Z",
    "maturityDate": "2031-01-02T10:50:00Z",
    "status": "active"
  },
  "message": "Successfully purchased $50000 of bond"
}
```

### 7. Get Trading Volume
**GET** `/api/v2/marketplace/trading-volume`

Get historical trading volume data.

**Response (200):**
```json
{
  "data": [
    {
      "month": "Jan",
      "volume": 150,
      "value": 2000000
    },
    {
      "month": "Feb",
      "volume": 175,
      "value": 2300000
    }
    // ... 12 months of data
  ]
}
```

### 8. Get Transaction History
**GET** `/api/v2/marketplace/transactions`

Get user's transaction history.

**Query Parameters:**
- `userId` - Filter by user ID (optional)
- `page` - Page number (default: 1)
- `size` - Items per page (default: 20)

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid-string",
      "sellerId": "uuid-string",
      "buyerId": "uuid-string",
      "riuId": "uuid-string",
      "quantity": 500,
      "amount": 41050.00,
      "txType": "purchase",
      "status": "completed",
      "createdAt": "2026-01-02T10:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20
  }
}
```

---

## Projects Endpoints

### 1. List Projects
**GET** `/api/v2/projects`

Get list of carbon credit projects.

**Query Parameters:**
- `page` - Page number (default: 1)
- `size` - Items per page (default: 20)
- `status` - Filter by status (optional): `pending_approval`, `approved`, `active`, `rejected`

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid-string",
      "ownerId": "uuid-string",
      "name": "Amazon Rainforest Restoration",
      "description": "Large-scale restoration project",
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
    "size": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### 2. Get Project Details
**GET** `/api/v2/projects/{id}`

Get detailed information about a project.

**Response (200):**
```json
{
  "project": {
    "id": "uuid-string",
    "ownerId": "uuid-string",
    "name": "Amazon Rainforest Restoration",
    "description": "Large-scale restoration project",
    "projectType": "regenerative-ag",
    "status": "approved",
    "targetCO2Reduction": 10000,
    "actualCO2Reduction": 5000,
    "biodiversityScore": 85.5,
    "healthImpactScore": 78.2,
    "areaHectares": 5000,
    "createdAt": "2025-12-01T00:00:00Z"
  },
  "measurements": [
    {
      "id": "uuid-string",
      "measurementDate": "2026-01-02T10:00:00Z",
      "satelliteSource": "Sentinel-2",
      "co2Level": 410,
      "soilCarbonPpm": 45.5,
      "ndviIndex": 0.75,
      "biodiversityScore": 85.5
    }
  ]
}
```

### 3. Create Project
**POST** `/api/v2/projects`

Create a new carbon credit project.

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "ownerId": "uuid-string",
  "name": "Mangrove Restoration Initiative",
  "description": "Restoring mangrove forests in coastal regions",
  "projectType": "restoration",
  "location": "Southeast Asia",
  "bioregion": "tropical_coastal",
  "startDate": "2026-01-15",
  "targetCO2Reduction": 5000,
  "areaHectares": 2000,
  "biodiversityScore": 75,
  "healthImpactScore": 80
}
```

**Response (201):**
```json
{
  "project": {
    "id": "uuid-string",
    "ownerId": "uuid-string",
    "name": "Mangrove Restoration Initiative",
    "status": "pending_approval",
    "targetCO2Reduction": 5000,
    "areaHectares": 2000,
    "biodiversityScore": 75,
    "healthImpactScore": 80,
    "createdAt": "2026-01-02T11:00:00Z"
  },
  "message": "Project created successfully"
}
```

### 4. Update Project
**PUT** `/api/v2/projects/{id}`

Update project information.

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "active",
  "actualCO2Reduction": 5000,
  "biodiversityScore": 85,
  "healthImpactScore": 82
}
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "status": "active",
  "actualCO2Reduction": 5000,
  "biodiversityScore": 85,
  "healthImpactScore": 82,
  "updatedAt": "2026-01-02T11:15:00Z"
}
```

### 5. Get Project Statistics
**GET** `/api/v2/projects/{id}/stats`

Get detailed statistics for a project.

**Response (200):**
```json
{
  "projectId": "uuid-string",
  "projectName": "Mangrove Restoration Initiative",
  "status": "active",
  "co2Target": 5000,
  "co2Achieved": 4500,
  "co2Percentage": 90,
  "biodiversityScore": 85,
  "healthImpactScore": 82,
  "measurementCount": 52,
  "areaHectares": 2000,
  "riusIssued": 4500,
  "riusRetired": 100
}
```

### 6. Approve Project
**POST** `/api/v2/projects/{id}/approve`

Approve a pending project (admin only).

**Request Body:**
```json
{
  "approverNotes": "Project meets all criteria and standards"
}
```

**Response (200):**
```json
{
  "project": {
    "id": "uuid-string",
    "status": "approved",
    "approvalNotes": "Project meets all criteria and standards",
    "approvedAt": "2026-01-02T11:30:00Z"
  },
  "message": "Project approved successfully"
}
```

### 7. Reject Project
**POST** `/api/v2/projects/{id}/reject`

Reject a pending project (admin only).

**Request Body:**
```json
{
  "rejectionReason": "Insufficient biodiversity impact evidence"
}
```

**Response (200):**
```json
{
  "project": {
    "id": "uuid-string",
    "status": "rejected",
    "rejectionReason": "Insufficient biodiversity impact evidence",
    "rejectedAt": "2026-01-02T11:35:00Z"
  },
  "message": "Project rejected"
}
```

---

## Measurements Endpoints

### 1. Get Project Measurements
**GET** `/api/v2/measurements/project/{projectId}`

Get measurement data for a specific project.

**Query Parameters:**
- `page` - Page number (default: 1)
- `size` - Items per page (default: 50)

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid-string",
      "measurementDate": "2026-01-02T10:00:00Z",
      "satelliteSource": "Sentinel-2",
      "co2Level": 410,
      "soilCarbonPpm": 45.5,
      "ndviIndex": 0.75,
      "biodiversityScore": 85.5,
      "confidenceLevel": 0.95,
      "anomalyFlag": false
    }
  ],
  "pagination": {
    "page": 1,
    "size": 50,
    "total": 520
  }
}
```

### 2. Record Measurement
**POST** `/api/v2/measurements`

Record a new measurement for a project.

**Headers Required:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "projectId": "uuid-string",
  "measurementDate": "2026-01-02T14:00:00Z",
  "satelliteSource": "Landsat-8",
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
}
```

**Response (201):**
```json
{
  "measurement": {
    "id": "uuid-string",
    "projectId": "uuid-string",
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

### 3. Get Anomalies
**GET** `/api/v2/measurements/anomalies`

Get detected anomalies in measurements.

**Query Parameters:**
- `projectId` - Filter by project (optional)
- `page` - Page number (default: 1)

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid-string",
      "projectId": "uuid-string",
      "measurementDate": "2025-11-15T10:00:00Z",
      "co2Level": 520,
      "anomalyFlag": true,
      "anomalyReason": "CO2 level exceeds expected range"
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20
  }
}
```

### 4. Get Measurement Trends
**GET** `/api/v2/measurements/{projectId}/trends`

Get trend data for measurements over time.

**Query Parameters:**
- `days` - Number of days to retrieve (default: 365)

**Response (200):**
```json
{
  "projectId": "uuid-string",
  "period": "365 days",
  "trends": [
    {
      "date": "2026-01-02T00:00:00Z",
      "co2": 412,
      "soilCarbon": 45.8,
      "ndvi": 0.76,
      "biodiversity": 85.5,
      "measurementCount": 3
    }
  ]
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "code": "error_code",
  "message": "Human readable error message"
}
```

### Common Error Codes
- `invalid` - Invalid request parameters
- `unauthorized` - Missing or invalid authentication token
- `not_found` - Resource not found
- `insufficient_quantity` - Not enough RIUs available
- `email_exists` - Email already registered
- `server_error` - Internal server error

## Rate Limiting

Currently no rate limiting is implemented. Production deployment should include:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Testing the API

### Using cURL
```bash
# Sign up
curl -X POST http://localhost:3001/api/v2/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get market data (no auth required)
curl http://localhost:3001/api/v2/marketplace/riums/market

# Get projects
curl "http://localhost:3001/api/v2/projects?page=1&size=10"
```

### Using Postman
1. Import the OpenAPI spec
2. Set base URL to `http://localhost:3001/api`
3. Use pre-request script to manage tokens:
   ```javascript
   if (!pm.environment.get('token')) {
     // Login first
   }
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```

---

**Last Updated:** January 2, 2026
**Version:** 2.0.0
**Status:** Production Ready
