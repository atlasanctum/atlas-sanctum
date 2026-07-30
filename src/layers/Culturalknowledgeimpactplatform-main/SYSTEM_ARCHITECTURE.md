# Global Knowledge Ecosystem Dashboard - System Architecture

## Visual Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                             │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Dashboard (App.tsx)                                              │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │   │
│  │  │   TopNav    │  │  Sidebar    │  │   Main      │             │   │
│  │  │  [Status]   │  │             │  │  Content    │             │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        FEATURE COMPONENTS LAYER                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐        │
│  │ ImpactStories   │  │ CollaborationHub│  │ ConnectionStatus │        │
│  ├─────────────────┤  ├─────────────────┤  ├──────────────────┤        │
│  │ • View Stories  │  │ • View Topics   │  │ • Health Check   │        │
│  │ • Submit Story  │  │ • Create Topic  │  │ • Visual Status  │        │
│  │ • Like Story    │  │ • Filter Tags   │  │ • Auto Refresh   │        │
│  │ • Loading State │  │ • Loading State │  │                  │        │
│  └────────┬────────┘  └────────┬────────┘  └────────┬─────────┘        │
└───────────┼─────────────────────┼─────────────────────┼──────────────────┘
            │                     │                     │
            └─────────────────────┴─────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          API ABSTRACTION LAYER                            │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  API Utilities (src/app/utils/api.ts)                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │   │
│  │  │   Stories    │  │ Discussions  │  │    Health    │          │   │
│  │  │     API      │  │     API      │  │    Check     │          │   │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤          │   │
│  │  │ fetchStories │  │fetchDiscussio│  │ healthCheck  │          │   │
│  │  │ submitStory  │  │createDiscussi│  │              │          │   │
│  │  │ likeStory    │  │              │  │              │          │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │   │
│  │                                                                   │   │
│  │  Common Request Handler:                                         │   │
│  │  • Headers: Authorization, Content-Type                          │   │
│  │  • Error Handling & Logging                                      │   │
│  │  • JSON Parsing                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                   HTTPS with Bearer Token
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      SUPABASE EDGE FUNCTION                               │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Hono Server (supabase/functions/server/index.tsx)               │   │
│  │                                                                    │   │
│  │  Routes:                                                           │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │ GET    /stories          → Fetch all stories              │  │   │
│  │  │ POST   /stories          → Create new story               │  │   │
│  │  │ POST   /stories/:id/like → Increment likes                │  │   │
│  │  │ GET    /discussions      → Fetch all discussions          │  │   │
│  │  │ POST   /discussions      → Create new discussion          │  │   │
│  │  │ GET    /research/nodes   → Fetch research nodes           │  │   │
│  │  │ POST   /init-data        → Seed default data              │  │   │
│  │  │ GET    /health           → Health check                   │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                    │   │
│  │  Middleware:                                                       │   │
│  │  • CORS (allow all origins)                                       │   │
│  │  • Logger (console.log)                                           │   │
│  │  • Error handling                                                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        DATA PERSISTENCE LAYER                             │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  KV Store (kv_store.tsx + Postgres)                              │   │
│  │                                                                    │   │
│  │  Operations:                                                       │   │
│  │  • get(key)          - Retrieve single value                      │   │
│  │  • set(key, value)   - Store value                                │   │
│  │  • del(key)          - Delete value                               │   │
│  │  • mget(keys)        - Get multiple values                        │   │
│  │  • mset(entries)     - Set multiple values                        │   │
│  │  • getByPrefix(pre)  - Get all with prefix                        │   │
│  │                                                                    │   │
│  │  Data Structure:                                                   │   │
│  │  ┌────────────────────────────────────────┐                      │   │
│  │  │ Key Pattern    │ Purpose               │                      │   │
│  │  ├────────────────────────────────────────┤                      │   │
│  │  │ story:*        │ Impact stories        │                      │   │
│  │  │ discussion:*   │ Collaboration topics  │                      │   │
│  │  │ research_node:*│ Knowledge graph nodes │                      │   │
│  │  └────────────────────────────────────────┘                      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### Example 1: Submitting a Story

```
User fills form → Clicks "Submit Story"
         ↓
ImpactStories.tsx → handleSubmit()
         ↓
API Layer → submitStory({ title, category, story })
         ↓
Server → POST /make-server-f7350c8a/stories
         ↓
Validation → Check required fields
         ↓
Generate ID → story:1738561234_abc123
         ↓
KV Store → set(id, storyData)
         ↓
Server Response → { success: true, data: {...} }
         ↓
UI Update → Add to stories list + Show success toast
         ↓
Page Refresh → Data persists
```

### Example 2: Viewing Stories

```
User navigates to "Global Stories"
         ↓
ImpactStories.tsx → useEffect() → loadStories()
         ↓
Show loading spinner
         ↓
API Layer → fetchStories()
         ↓
Server → GET /make-server-f7350c8a/stories
         ↓
KV Store → getByPrefix("story:")
         ↓
Sort by timestamp (newest first)
         ↓
Server Response → { success: true, data: [...] }
         ↓
Check if empty → Call initializeData() if needed
         ↓
Hide loading spinner
         ↓
Render story cards
```

### Example 3: Connection Status Check

```
Component Mount → ConnectionStatus.tsx
         ↓
Initial state: "checking"
         ↓
API Layer → healthCheck()
         ↓
Server → GET /make-server-f7350c8a/health
         ↓
Server Response → { status: "ok" }
         ↓
Update state: "connected"
         ↓
Display: Green badge with "Connected"
         ↓
Set interval: Check every 30 seconds
         ↓
If fails: Display red badge with "Offline"
```

## Key Components Breakdown

### Frontend Components

```
/src/app/
├── App.tsx                          # Main app component with routing
├── components/
│   ├── ImpactStories.tsx            # ✅ Stories with backend integration
│   ├── CollaborationHub.tsx         # ✅ Discussions with backend integration
│   ├── ConnectionStatus.tsx         # ✅ Backend health monitor
│   ├── ResearchHub.tsx              # Research papers and knowledge graph
│   ├── KnowledgeGraph.tsx           # Interactive visualization
│   ├── ResearchAssistant.tsx        # AI assistant interface
│   └── GlobalStats.tsx              # Analytics dashboard
├── dashboard/
│   ├── TopNav.tsx                   # ✅ Includes ConnectionStatus
│   ├── Sidebar.tsx                  # Navigation menu
│   ├── Overview.tsx                 # Dashboard overview
│   ├── MyProjects.tsx               # Project management
│   ├── TaskBoard.tsx                # Task tracking
│   └── Settings.tsx                 # User settings
└── utils/
    └── api.ts                       # ✅ API abstraction layer
```

### Backend Components

```
/supabase/functions/server/
├── index.tsx                        # ✅ Main server with all routes
└── kv_store.tsx                     # ✅ Protected KV utility (do not edit)

/utils/supabase/
└── info.tsx                         # ✅ Supabase credentials (auto-generated)
```

### Documentation

```
/
├── BACKEND_GUIDE.md                 # ✅ API reference and usage
├── TESTING_GUIDE.md                 # ✅ Testing procedures
├── IMPLEMENTATION_SUMMARY.md        # ✅ This document
└── SYSTEM_ARCHITECTURE.md           # ✅ Visual diagrams
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18.3.1 | UI components and state management |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **UI Components** | Radix UI + shadcn/ui | Accessible component library |
| **Icons** | Lucide React | Icon library |
| **Animations** | Motion (Framer Motion) | Smooth animations |
| **Notifications** | Sonner | Toast notifications |
| **Backend** | Supabase Edge Functions | Serverless backend |
| **Server Framework** | Hono | Fast web framework for Deno |
| **Database** | Supabase (Postgres) | Data persistence |
| **Data Layer** | KV Store | Key-value abstraction |
| **Runtime** | Deno | Server runtime |

## Security Architecture

```
┌────────────────────────────────────────────────────┐
│  Public Frontend                                    │
│  • Uses SUPABASE_ANON_KEY                          │
│  • Safe to expose in browser                       │
│  • Limited permissions                             │
└──────────────────┬─────────────────────────────────┘
                   │
                   │ HTTPS + Bearer Token
                   │
┌──────────────────▼─────────────────────────────────┐
│  Supabase Edge Function                            │
│  • Validates requests                              │
│  • Rate limiting (future)                          │
│  • Input sanitization                              │
└──────────────────┬─────────────────────────────────┘
                   │
                   │ Uses SUPABASE_SERVICE_ROLE_KEY
                   │ (Server-side only - not exposed)
                   │
┌──────────────────▼─────────────────────────────────┐
│  Supabase Backend                                  │
│  • Full database access                            │
│  • Secure credentials                              │
│  • Protected operations                            │
└────────────────────────────────────────────────────┘
```

## Performance Characteristics

| Operation | Expected Time | Notes |
|-----------|---------------|-------|
| Health Check | < 100ms | Simple server ping |
| Fetch Stories | < 500ms | Depends on data volume |
| Submit Story | < 1000ms | Includes validation |
| Like Story | < 300ms | Single update operation |
| Init Data | < 2000ms | Seeds 7 records |

## Error Handling Strategy

```
Error Level 1: Network Errors
├─ Catch: API request fails
├─ Action: Log to console
└─ User: Toast notification

Error Level 2: Validation Errors
├─ Catch: Missing required fields
├─ Action: Log validation error
└─ User: Toast with specific message

Error Level 3: Server Errors
├─ Catch: Database or server issues
├─ Action: Log detailed error
└─ User: Generic "try again" message

Error Level 4: Connection Errors
├─ Catch: Health check fails
├─ Action: Update connection status
└─ User: Red "Offline" badge
```

## State Management

```
Component State (useState)
├─ Form inputs
├─ Loading flags
├─ Dialog open/close
└─ Local UI state

API State
├─ Fetched stories
├─ Fetched discussions
├─ Connection status
└─ Submission status

Server State (KV Store)
├─ Persistent stories
├─ Persistent discussions
└─ Persistent research nodes
```

## Future Integration Points

### Phase 1: Ready to Connect
- Real-time subscriptions (Supabase Realtime)
- User authentication (Supabase Auth)
- File uploads (Supabase Storage)

### Phase 2: Can Be Extended
- Search functionality (Postgres full-text search)
- Analytics tracking (custom endpoints)
- Email notifications (Supabase email templates)

### Phase 3: Advanced Features
- WebSocket connections
- Redis caching
- CDN integration
- Multi-region deployment

---

**Status:** ✅ Production Ready  
**Last Updated:** February 3, 2026  
**Version:** 1.0.0
