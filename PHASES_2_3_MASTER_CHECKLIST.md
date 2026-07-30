# 📋 PHASE 2-3 MASTER IMPLEMENTATION CHECKLIST

**Atlas Sanctum: Complete Implementation Roadmap**

**Current Status:** Phase 1 Live ✅  
**Next:** Phase 2 (Weeks 2-4)  
**Then:** Phase 3 (Month 2-3)

---

## 🎯 QUICK OVERVIEW

```
PHASE 1: COMPLETE ✅
├─ Frontend: 100%
├─ Backend: 100%
├─ Database: 100%
└─ 10 Features: 100%

PHASE 2: READY (40h over 2 weeks)
├─ Payments: Paystack + PayPal
├─ Email: SendGrid integration
└─ Security: Rate limiting, API keys, RBAC

PHASE 3: ARCHITECTED (Choose 1-2 of 3)
├─ Real-Time: WebSocket live updates (44h)
├─ Mobile: React Native iOS+Android (80h)
└─ Blockchain: Smart contracts (60h)
```

---

# 🔴 PHASE 2: WEEKS 2-4 (40 HOURS)

## WEEK 2: PAYMENTS + EMAIL (16 HOURS)

### Preparation (Day 1)
- [ ] Create Paystack account
  - Go to https://dashboard.paystack.co
  - Verify email and phone
  - Get API keys (Public + Secret)
  - Copy to environment variables
  
- [ ] Create SendGrid account
  - Go to https://sendgrid.com
  - Create API key
  - Verify sender email
  - Create email templates
  
- [ ] Review documentation
  - [ ] Read PHASE_2_EXECUTION_PLAN.md
  - [ ] Understand payment flow
  - [ ] Understand email architecture
  - [ ] Review security requirements

### Day 1-2: Payment Processing (8 hours)

**Backend Services:**
- [ ] Create `scaffold-mvp/backend/src/services/paymentService.ts`
  - [ ] Paystack initialization method
  - [ ] Paystack verification method
  - [ ] Webhook signature verification
  - [ ] PayPal integration (optional)
  - [ ] Error handling
  - [ ] Logging

- [ ] Create `scaffold-mvp/backend/src/routes/payments.ts`
  - [ ] POST /api/v2/payments/initialize
  - [ ] POST /api/v2/payments/verify
  - [ ] POST /api/v2/webhooks/paystack
  - [ ] POST /api/v2/webhooks/paypal
  - [ ] Error handling
  - [ ] Authentication middleware

**Database:**
- [ ] Run migration: Create transactions table
  - [ ] id (UUID)
  - [ ] user_id (FK)
  - [ ] amount
  - [ ] currency
  - [ ] status
  - [ ] reference
  - [ ] payment_method
  - [ ] created_at, updated_at

**Frontend:**
- [ ] Create payment form component
  - [ ] Email input
  - [ ] Amount input
  - [ ] Card details
  - [ ] Submit button
  - [ ] Loading state
  - [ ] Error display

- [ ] Create payment callback handler
  - [ ] Handle success
  - [ ] Handle failure
  - [ ] Update transaction status
  - [ ] Redirect to dashboard

**Testing:**
- [ ] [ ] Test Paystack sandbox
  - [ ] Initialize transaction
  - [ ] Verify payment
  - [ ] Test webhook signature
  - [ ] Test with real test card

- [ ] [ ] Test end-to-end payment flow
  - [ ] User fills form
  - [ ] Redirected to Paystack
  - [ ] Payment verified
  - [ ] Transaction saved to database
  - [ ] User notified of success

**Deployment:**
- [ ] Deploy to staging
- [ ] Test in staging environment
- [ ] Fix any issues
- [ ] Ready for production

### Day 3-4: Email Service (8 hours)

**Backend Services:**
- [ ] Create `scaffold-mvp/backend/src/services/emailService.ts`
  - [ ] Welcome email
  - [ ] Payment receipt email
  - [ ] Password reset email
  - [ ] Project notification email
  - [ ] Error handling
  - [ ] Retry logic

- [ ] Create `scaffold-mvp/backend/src/workers/emailWorker.ts`
  - [ ] Email queue processor
  - [ ] Process pending emails
  - [ ] Retry failed emails
  - [ ] Update email status
  - [ ] Logging

**Database:**
- [ ] Run migration: Create email_queue table
  - [ ] id (UUID)
  - [ ] type (email type)
  - [ ] data (JSONB)
  - [ ] status (pending, sent, failed)
  - [ ] retry_count
  - [ ] sent_at
  - [ ] created_at, updated_at

**Email Templates:**
- [ ] Welcome email template
- [ ] Payment receipt template
- [ ] Password reset template
- [ ] Project notification template
- [ ] Newsletter template

**Integration:**
- [ ] Queue email when user signs up
- [ ] Queue email when payment completed
- [ ] Queue email for password reset
- [ ] Queue email for project updates

**Testing:**
- [ ] Test email queueing
- [ ] Test email sending
- [ ] Test email delivery (SendGrid)
- [ ] Test retry logic
- [ ] Verify email templates

**Deployment:**
- [ ] Deploy to staging
- [ ] Send test email
- [ ] Verify delivery
- [ ] Ready for production

### Day 5: Integration Testing (4 hours)

**End-to-End Tests:**
- [ ] User signs up → Welcome email sent
- [ ] User makes payment → Payment receipt sent
- [ ] User requests password reset → Reset email sent
- [ ] Project updated → Notification email sent

**Performance Tests:**
- [ ] Payment latency <2 seconds
- [ ] Email queued <100ms
- [ ] Email sent <30 seconds

**Deployment to Staging:**
- [ ] All tests passing
- [ ] No console errors
- [ ] Code reviewed
- [ ] Ready for Week 3

---

## WEEK 3: SECURITY HARDENING (16 HOURS)

### Day 1-2: Rate Limiting + CORS (6 hours)

**Rate Limiting Middleware:**
- [ ] Create `scaffold-mvp/backend/src/middleware/rateLimiter.ts`
  - [ ] General limiter: 100 req/15min
  - [ ] Auth limiter: 10 req/15min
  - [ ] Payment limiter: 10 req/hour
  - [ ] Login limiter: 5 attempts/15min
  - [ ] Custom error messages
  - [ ] Logging

**Apply Rate Limiting:**
- [ ] Add to auth routes
- [ ] Add to payment routes
- [ ] Add to general API
- [ ] Test with curl (100+ requests)

**CORS Hardening:**
- [ ] Create `scaffold-mvp/backend/src/config/cors.ts`
  - [ ] Whitelist allowed origins
  - [ ] Allow specific methods
  - [ ] Expose necessary headers
  - [ ] Handle credentials
  - [ ] Deny invalid origins

**Apply CORS:**
- [ ] Apply to all routes
- [ ] Test with allowed origin
- [ ] Test with invalid origin (should fail)
- [ ] Verify headers

**Testing:**
- [ ] Test rate limiting kicks in
- [ ] Test CORS accepts valid origin
- [ ] Test CORS blocks invalid origin
- [ ] Test error messages

### Day 3-4: API Keys + RBAC (10 hours)

**API Key Service:**
- [ ] Create `scaffold-mvp/backend/src/services/apiKeyService.ts`
  - [ ] Generate API key
  - [ ] Validate API key
  - [ ] Revoke API key
  - [ ] List user keys
  - [ ] Hash keys with bcrypt
  - [ ] Expiration logic

**Database Migration:**
- [ ] Create api_keys table
  - [ ] id
  - [ ] user_id
  - [ ] hashed_key
  - [ ] name
  - [ ] expires_at
  - [ ] last_used_at
  - [ ] revoked_at

**Apply API Key Auth:**
- [ ] Create middleware: `apiKeyAuth.ts`
  - [ ] Extract key from header
  - [ ] Validate key
  - [ ] Add user to request
  - [ ] Error handling

- [ ] Add API key endpoints
  - [ ] POST /api/v2/admin/api-keys (create)
  - [ ] GET /api/v2/admin/api-keys (list)
  - [ ] DELETE /api/v2/admin/api-keys/:id (revoke)

**RBAC System:**
- [ ] Create `scaffold-mvp/backend/src/services/rbacService.ts`
  - [ ] Define roles: admin, moderator, user, guest
  - [ ] Define permissions
  - [ ] Check permissions
  - [ ] Role validation

- [ ] Create RBAC middleware: `roleCheck.ts`
  - [ ] requirePermission middleware
  - [ ] requireRole middleware
  - [ ] Error handling

**Database Migration:**
- [ ] Add role column to users table (if not exists)

**Apply RBAC:**
- [ ] Protect admin endpoints
  - [ ] /api/v2/admin/* requires admin role
  
- [ ] Protect user endpoints
  - [ ] /api/v2/portfolio requires user role
  
- [ ] Protect public endpoints
  - [ ] /api/v2/marketplace doesn't require auth

**Testing:**
- [ ] Generate API key
- [ ] Use API key to authenticate
- [ ] Revoke API key (should fail after)
- [ ] Test RBAC on protected endpoint
- [ ] Test insufficient permissions

### Day 5: Security Audit + Deployment (4 hours)

**Security Checklist:**
- [ ] No hardcoded secrets
- [ ] Environment variables all set
- [ ] Password hashing using bcrypt (upgrade from SHA-256)
- [ ] API keys hashed properly
- [ ] Rate limiting working
- [ ] CORS properly configured
- [ ] RBAC enforced
- [ ] No console logs with secrets
- [ ] Error messages don't expose sensitive info
- [ ] Database backups verified

**Production Deployment:**
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Staging environment tested
- [ ] Backup database
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Verify all features working

**Post-Deployment:**
- [ ] Test payment flow
- [ ] Send test email
- [ ] Test rate limiting
- [ ] Test API keys
- [ ] Test RBAC
- [ ] Monitor metrics

---

## ✅ PHASE 2 COMPLETION CRITERIA

**Week 2 Complete When:**
- [x] Payments working end-to-end
- [x] 10+ test transactions completed
- [x] Emails queuing and sending
- [x] >99% email delivery rate
- [x] All integration tests passing

**Week 3 Complete When:**
- [x] Rate limiting active and tested
- [x] CORS properly restricting origins
- [x] API keys generating and validating
- [x] RBAC enforced on endpoints
- [x] Security audit passed
- [x] Zero critical issues in production

**Phase 2 Final When:**
- [x] All 40 hours completed
- [x] All systems tested
- [x] Team confident
- [x] Phase 3 ready to start
- [x] Production stable

---

# 🟡 PHASE 3: CHOOSE YOUR PATH (44-80 HOURS)

## 🟢 PATH A: REAL-TIME FEATURES (44 Hours)

### Priority: HIGHEST (Start First)
### Timeline: Weeks 1-2 of Month 2
### Team Size: 2-3 developers

### Week 1: Infrastructure (20 hours)

**Setup WebSocket Server:**
- [ ] Install Socket.io
- [ ] Create WebSocket server
- [ ] Setup authentication middleware
- [ ] Test connection

**Components:**
- [ ] `scaffold-mvp/backend/src/websocket/server.ts` - Main WebSocket server
- [ ] `scaffold-mvp/backend/src/websocket/handlers/priceUpdates.ts` - Price feeds
- [ ] `scaffold-mvp/backend/src/websocket/handlers/notifications.ts` - Notifications
- [ ] `scaffold-mvp/backend/src/websocket/handlers/orderBook.ts` - Live orders

**Features:**
- [ ] Connect authenticated users
- [ ] Subscribe to market updates
- [ ] Emit price changes (every 2 seconds)
- [ ] Send notifications in real-time
- [ ] Track user presence

**Testing:**
- [ ] Test 10 concurrent users
- [ ] Test 100 concurrent users
- [ ] Verify message delivery
- [ ] Check latency (<500ms)

### Week 2: Frontend + Testing (24 hours)

**Frontend Integration:**
- [ ] Create WebSocket client connection
  - [ ] `src/lib/websocket/client.ts`
  
- [ ] Create hooks
  - [ ] `useRealtimeData` - Get live prices
  - [ ] `useNotifications` - Get live notifications
  - [ ] `useOrderBook` - Get live orders
  - [ ] `usePresence` - User presence

- [ ] Create components
  - [ ] `LivePriceDisplay` - Show updating prices
  - [ ] `LiveNotifications` - Show notifications
  - [ ] `LiveOrderBook` - Show live orders

**Testing:**
- [ ] Test connection stability
- [ ] Test price updates
- [ ] Test notifications delivery
- [ ] Load test (100+ concurrent)
- [ ] Test error recovery

**Deployment:**
- [ ] Deploy to staging
- [ ] Test all features
- [ ] Production deployment
- [ ] Monitor performance

**Success Metrics:**
- ✅ <500ms price update latency
- ✅ 99%+ uptime
- ✅ <1% message loss
- ✅ Support 100+ concurrent users

---

## 🟠 PATH B: MOBILE APP (80 Hours)

### Priority: HIGH (Can Start with Path A)
### Timeline: Weeks 1-3 of Month 2
### Team Size: 2-3 React Native developers

### Week 1: Setup + Auth (24 hours)

**Project Setup:**
- [ ] Create Expo project
- [ ] Install dependencies
  - [ ] React Navigation
  - [ ] React Query
  - [ ] Async Storage
  
- [ ] Create auth screens
  - [ ] `app/(auth)/login.tsx`
  - [ ] `app/(auth)/signup.tsx`
  - [ ] `app/(auth)/resetPassword.tsx`

**Testing:**
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test login flow
- [ ] Test signup flow

### Week 2: Core Screens (32 hours)

**Marketplace Screen:**
- [ ] Create `app/(tabs)/marketplace.tsx`
- [ ] List RIU listings
- [ ] Search/filter functionality
- [ ] Buy button implementation

**Portfolio Screen:**
- [ ] Create `app/(tabs)/portfolio.tsx`
- [ ] Show user holdings
- [ ] Display performance metrics
- [ ] Transaction history

**Governance Screen:**
- [ ] Create `app/(tabs)/governance.tsx`
- [ ] Show active proposals
- [ ] Voting interface
- [ ] Proposal details

**Account Screen:**
- [ ] Create `app/(tabs)/account.tsx`
- [ ] User profile
- [ ] Settings
- [ ] Logout

**Testing:**
- [ ] Test on actual devices (if possible)
- [ ] Test navigation
- [ ] Test data fetching
- [ ] Test performance

### Week 3: Polish + Deployment (24 hours)

**Optimization:**
- [ ] Reduce bundle size (<50MB)
- [ ] Optimize images
- [ ] Test performance
- [ ] Fix any bugs

**App Store Submission:**
- [ ] Create iOS build
  - [ ] Setup signing certificate
  - [ ] Create App Store identifier
  - [ ] Upload to TestFlight
  - [ ] Submit to App Store
  
- [ ] Create Android build
  - [ ] Setup signing key
  - [ ] Create Play Store identifier
  - [ ] Upload APK/AAB
  - [ ] Submit to Google Play

**Testing:**
- [ ] Test on actual devices
- [ ] Test all features
- [ ] Verify app store presence
- [ ] Monitor ratings

**Success Metrics:**
- ✅ iOS app in App Store
- ✅ Android app in Google Play
- ✅ >4.0 rating
- ✅ <50MB bundle size

---

## 🟣 PATH C: BLOCKCHAIN (60 Hours)

### Priority: MEDIUM (Start after Path A)
### Timeline: Weeks 1-2.5 of Month 2
### Team Size: 1-2 smart contract developers

### Week 1: Smart Contracts (24 hours)

**Setup Hardhat:**
- [ ] Install Hardhat
- [ ] Setup project structure
- [ ] Configure networks (Polygon testnet)

**RIU Token Contract:**
- [ ] Create `contracts/RIUToken.sol`
  - [ ] Implement ERC-20 standard
  - [ ] Mint/burn functionality
  - [ ] Approve spending

**Marketplace Contract:**
- [ ] Create `contracts/Marketplace.sol`
  - [ ] Create sell orders
  - [ ] Buy tokens
  - [ ] Cancel orders
  - [ ] Escrow logic

**Testing:**
- [ ] Unit tests for all functions
- [ ] Integration tests
- [ ] Test on local network
- [ ] Deploy to testnet

### Week 2: Integration + Deployment (20 hours)

**Frontend Integration:**
- [ ] Setup ethers.js
- [ ] Create wallet connection hook
  - [ ] MetaMask integration
  - [ ] WalletConnect support
  
- [ ] Create blockchain components
  - [ ] Wallet connection button
  - [ ] Transaction approval
  - [ ] Transaction confirmation

**Testing:**
- [ ] Test wallet connection
- [ ] Test transactions
- [ ] Test contract interactions
- [ ] Test on testnet

**Deployment:**
- [ ] Deploy to Polygon testnet
- [ ] Verify contract on Polygonscan
- [ ] Test end-to-end
- [ ] Document contract addresses

**Success Metrics:**
- ✅ Contracts deployed on Polygon
- ✅ Wallet integration working
- ✅ On-chain trading functional
- ✅ Transaction verification successful

---

## 📊 PARALLEL IMPLEMENTATION PLAN

### Month 2: Parallel Work

**Week 1:**
```
Path A: WebSocket infrastructure (40%)
Path B: Project setup + auth (30%)
Path C: Smart contracts (30%)
```

**Week 2:**
```
Path A: Frontend integration (60%)
Path B: Marketplace + portfolio screens (60%)
Path C: Integration + testnet deployment (70%)
```

**Week 3:**
```
Path A: Testing + production (100%)
Path B: Polish + app store (100%)
Path C: Mainnet preparation (80%)
```

---

## 🎯 COMBINED SUCCESS CRITERIA

### All Paths Complete When:
- [ ] Phase 2 fully operational (payments, email, security)
- [ ] Path A: Real-Time working with <500ms latency
- [ ] Path B: Both apps in app stores with >4.0 rating
- [ ] Path C: Smart contracts deployed on Polygon
- [ ] Combined: Feature-complete, production-ready platform
- [ ] User growth: 100+ → 1,000+ users
- [ ] Revenue: Payment system processing transactions
- [ ] Team: Confident in all systems
- [ ] Documentation: Complete and up-to-date

---

## 📋 OVERALL TIMELINE SUMMARY

```
🟢 PHASE 1: COMPLETE ✅
  └─ Status: Live in production

🔴 PHASE 2: WEEKS 2-4
  ├─ Week 2: Payments + Email (16h)
  ├─ Week 3: Security (16h)
  ├─ Week 4: Monitoring + Phase 3 planning
  └─ Status: Enables revenue + security

🟡 PHASE 3: MONTH 2-3
  ├─ Path A: Real-Time (44h) - WEEKS 1-2
  ├─ Path B: Mobile (80h) - WEEKS 1-3 (parallel)
  ├─ Path C: Blockchain (60h) - WEEKS 1-2.5 (parallel)
  └─ Status: Advanced features + scale
```

---

## 💰 TOTAL INVESTMENT SUMMARY

| Phase | Hours | Cost | Timeline |
|-------|-------|------|----------|
| Phase 1 | 420 | $0 (invested) | Complete ✅ |
| Phase 2 | 40 | $0 + infra | 2 weeks |
| Phase 3A | 44 | $0 + Redis | 2 weeks |
| Phase 3B | 80 | $0 + app fees | 3 weeks |
| Phase 3C | 60 | $0 + RPC | 2.5 weeks |
| **TOTAL** | **644h** | **~$200-300** | **3 months** |

---

## 🚀 GO/NO-GO CRITERIA

### Phase 2 Go Signal
- [x] Phase 1 is stable (99.9%+ uptime)
- [x] User feedback is positive
- [x] No critical bugs in Phase 1
- [x] Team ready for Phase 2
- [x] Infrastructure prepared
- [x] Documentation updated

### Phase 3 Go Signal
- [x] Phase 2 fully deployed
- [x] Payments working (10+ transactions)
- [x] Emails >99% delivery
- [x] Rate limiting protecting API
- [x] 50-100 users on platform
- [x] Team confident in systems
- [x] Path decided (A, B, or C)

---

## 📞 CONTACT & ESCALATION

**Phase 2 Lead:** [TBD]  
**Phase 3 Lead:** [TBD]  
**Engineering Manager:** [TBD]  
**DevOps Lead:** [TBD]  

**Daily Standup:** 9:00 AM UTC  
**Weekly Review:** Monday 4:00 PM UTC  
**Emergency Escalation:** [Phone/Slack]  

---

## ✅ MASTER CHECKLIST: READY TO START?

Before starting Phase 2:
- [ ] Phase 1 is stable and live
- [ ] Team briefed on Phase 2 plan
- [ ] Paystack account created
- [ ] SendGrid account created
- [ ] Staging environment ready
- [ ] Documentation reviewed
- [ ] Sprint planned
- [ ] Standups scheduled

---

**Next Step:** Start Phase 2 Week 1!

**Questions?**
- See PHASE_2_EXECUTION_PLAN.md for detailed steps
- See PHASE_3_IMPLEMENTATION_ROADMAP.md for advanced features
- See FULL_STACK_ENGINEERING_REVIEW.md for technical details

---

**Let's build the future of regenerative finance! 🌱💚**

