# Backend Integration Documentation

## Overview

This global knowledge ecosystem dashboard is now fully integrated with Supabase for persistent data storage. The backend enables real-time data persistence for Impact Stories and Collaboration discussions.

## Architecture

### Three-Tier Architecture
```
Frontend (React) → Server (Hono Edge Function) → Database (Supabase KV Store)
```

### Components

#### 1. **Frontend** (`/src`)
- **API Client** (`/src/utils/api.ts`): Centralized API communication layer
- **Impact Stories** (`/src/app/components/ImpactStories.tsx`): Story submission and display
- **Collaboration Hub** (`/src/app/components/CollaborationHub.tsx`): Discussion management
- **Connection Status** (`/src/app/components/ConnectionStatus.tsx`): Real-time backend status indicator

#### 2. **Backend** (`/supabase/functions/server`)
- **Server** (`index.tsx`): Hono web server with CORS-enabled API endpoints
- **KV Store** (`kv_store.tsx`): Database abstraction layer (auto-generated, protected)
- **Seed Data** (`seed.tsx`): Initial data population on first run

#### 3. **Database**
- Uses Supabase's `kv_store_f7350c8a` table
- Key-value structure with JSONB storage
- Prefixed keys for data organization:
  - `story:*` - Impact stories
  - `discussion:*` - Collaboration discussions

## API Endpoints

### Health Check
```
GET /make-server-f7350c8a/health
Response: { status: "ok" }
```

### Impact Stories

#### Get All Stories
```
GET /make-server-f7350c8a/stories
Response: { success: true, data: Story[] }
```

#### Submit Story
```
POST /make-server-f7350c8a/stories
Body: {
  title: string,
  category: string,
  story: string,
  author?: string
}
Response: { success: true, data: Story }
```

#### Like Story
```
POST /make-server-f7350c8a/stories/:id/like
Response: { success: true, data: Story }
```

### Collaboration Discussions

#### Get All Discussions
```
GET /make-server-f7350c8a/discussions
Response: { success: true, data: Discussion[] }
```

#### Submit Discussion
```
POST /make-server-f7350c8a/discussions
Body: {
  title: string,
  content: string,
  tag: string,
  author?: string,
  authorImage?: string
}
Response: { success: true, data: Discussion }
```

## Features

### ✅ Implemented
- [x] Persistent story submissions with validation
- [x] Real-time story fetching with loading states
- [x] Story like functionality
- [x] Discussion creation and retrieval
- [x] Automatic database seeding on first launch
- [x] Backend connection status indicator
- [x] Error handling with user-friendly toast notifications
- [x] Form validation and loading states
- [x] Optimistic UI updates

### 🔄 Data Flow

#### Submitting a Story
1. User fills out form in `ImpactStories` component
2. Form validation runs on submit
3. Loading state activates
4. API call to `POST /stories` endpoint
5. Server validates and stores in KV database
6. Success response triggers toast notification
7. Stories list refreshes with new data
8. Form resets and dialog closes

#### Fetching Stories
1. Component mounts (`useEffect`)
2. Loading spinner displays
3. API call to `GET /stories` endpoint
4. Server retrieves from KV store with prefix `story:`
5. Data sorted by timestamp (newest first)
6. Combined with default fallback stories
7. UI updates with fetched data

## Environment Variables

The following secrets are pre-configured:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key for frontend
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side admin key (protected)
- `SUPABASE_DB_URL` - Direct database connection URL

## Security Considerations

⚠️ **Important**: 
- The `SUPABASE_SERVICE_ROLE_KEY` is only used server-side and never exposed to the frontend
- Frontend uses `publicAnonKey` for API authentication
- CORS is enabled for all origins (suitable for prototyping)
- This setup is designed for prototyping and demo purposes
- Not designed for collecting PII or highly sensitive data

## Code Organization

### Frontend
```
/src
  /utils
    api.ts                    # API client with typed endpoints
  /app
    /components
      ImpactStories.tsx       # Story submission and display
      CollaborationHub.tsx    # Discussion management
      ConnectionStatus.tsx    # Backend health indicator
```

### Backend
```
/supabase
  /functions
    /server
      index.tsx              # Main server with routes
      kv_store.tsx          # Database layer (protected)
      seed.tsx              # Initial data seeding
```

## Testing the Integration

### 1. Check Backend Status
Look for the "Backend Connected" badge in the top navigation bar (green checkmark).

### 2. Submit a Story
1. Navigate to "Global Stories" section
2. Click "Contribute Story"
3. Fill in title, category, and story
4. Submit and watch for success toast
5. Your story should appear at the top of the list

### 3. Create a Discussion
1. Navigate to "Collaboration Hub"
2. Click "Start New Topic"
3. Fill in the form
4. Submit and verify it appears in the feed

### 4. Test Persistence
1. Submit data (story or discussion)
2. Refresh the browser
3. Data should persist and reload

## Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Displayed via toast notifications
- **Validation Errors**: Form-level validation with user feedback
- **API Errors**: Logged to console with descriptive messages
- **Fallback Data**: Default stories/discussions shown if API fails

## Database Schema

### Story Object
```typescript
{
  id: string,              // "story:{timestamp}-{random}"
  title: string,
  category: string,
  story: string,
  author: string,          // Defaults to "Anonymous"
  authorImage: string,
  likes: number,
  comments: number,
  timestamp: number,       // Unix timestamp for sorting
  createdAt: string        // ISO date string
}
```

### Discussion Object
```typescript
{
  id: string,              // "discussion:{timestamp}-{random}"
  title: string,
  content: string,
  tag: string,
  author: string,          // Defaults to "Anonymous"
  authorImage: string,
  replies: number,
  timestamp: number,       // Unix timestamp for sorting
  time: string,            // Human-readable time
  createdAt: string        // ISO date string
}
```

## Extending the Backend

To add new features:

1. **Add Route** in `/supabase/functions/server/index.tsx`
2. **Create API Method** in `/src/utils/api.ts`
3. **Update Component** to use new API method
4. **Handle Errors** appropriately

### Example: Adding Comments to Stories
```typescript
// 1. Backend route
app.post("/make-server-f7350c8a/stories/:id/comments", async (c) => {
  const storyId = c.req.param("id");
  const { comment, author } = await c.req.json();
  // Implementation here
});

// 2. API method
export const storyApi = {
  addComment: async (storyId: string, comment: string, author: string) => {
    return apiCall(`/stories/${storyId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment, author }),
    });
  },
};

// 3. Use in component
const handleAddComment = async () => {
  const result = await storyApi.addComment(storyId, comment, author);
  if (result.success) {
    toast.success("Comment added!");
  }
};
```

## Troubleshooting

### Backend Shows "Offline"
1. Check browser console for error messages
2. Verify Supabase Edge Function is running
3. Check CORS settings if making cross-origin requests

### Data Not Persisting
1. Check network tab for failed API calls
2. Verify API endpoint paths match server routes
3. Check server logs for database errors

### Stories/Discussions Not Loading
1. Verify backend is connected
2. Check if seed data was created (see server logs)
3. Try submitting a new item to test write operations

## Performance Considerations

- **Caching**: Stories and discussions are fetched on component mount
- **Optimistic Updates**: Like button updates UI immediately
- **Loading States**: Skeleton/spinner shown during API calls
- **Error Boundaries**: Fallback to default data on API failure

## Future Enhancements

Potential improvements for production:
- [ ] Add pagination for large datasets
- [ ] Implement real-time updates with Supabase Realtime
- [ ] Add user authentication
- [ ] Implement search and filtering on backend
- [ ] Add rate limiting and abuse protection
- [ ] Implement caching strategies
- [ ] Add analytics and monitoring
- [ ] Migrate from KV store to proper tables for complex queries

---

**Last Updated**: February 3, 2026  
**Version**: 1.0.0
