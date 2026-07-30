# Backend Integration Guide

## Overview

This application uses Supabase for backend persistence with a Hono-based Edge Function server. All data is stored in a key-value store that enables fast, flexible data management.

## Architecture

```
Frontend (React) → API Layer (/src/app/utils/api.ts) → Server (Supabase Edge Function) → KV Store (Postgres)
```

## API Endpoints

### Stories

- **GET** `/stories` - Fetch all impact stories
- **POST** `/stories` - Submit a new story
- **POST** `/stories/:id/like` - Like a story

### Discussions

- **GET** `/discussions` - Fetch all collaboration discussions
- **POST** `/discussions` - Create a new discussion

### Research

- **GET** `/research/nodes` - Fetch research nodes for knowledge graph

### Utilities

- **POST** `/init-data` - Initialize database with default data (called automatically on first load)
- **GET** `/health` - Health check endpoint

## Data Models

### Story
```typescript
{
  id: string;              // Format: "story:timestamp_randomId"
  title: string;
  category: string;
  excerpt: string;         // First 200 chars of story
  fullStory: string;
  author: string;
  authorImage: string;
  likes: number;
  comments: number;
  timestamp: number;
  image: string;
}
```

### Discussion
```typescript
{
  id: string;              // Format: "discussion:timestamp_randomId"
  title: string;
  content: string;
  author: string;
  authorImage: string;
  tag: string;
  replies: number;
  timestamp: number;
  time: string;
}
```

## Using the API

Import API functions from the utility module:

```typescript
import { 
  fetchStories, 
  submitStory, 
  likeStory,
  fetchDiscussions,
  createDiscussion
} from '@/app/utils/api';

// Example: Fetch stories
const response = await fetchStories();
if (response.success) {
  console.log(response.data);
}

// Example: Submit a new story
const result = await submitStory({
  title: "My Impact Story",
  category: "Environment",
  story: "This is my story...",
  author: "Jane Doe",
  authorImage: "https://..."
});
```

## Data Initialization

The application automatically initializes with default data on first load:
- 3 default impact stories
- 4 default collaboration discussions

This happens when components detect an empty database. You can also manually trigger initialization by calling the `/init-data` endpoint.

## Environment Variables

The following environment variables are pre-configured:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key (safe for frontend)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-only)
- `SUPABASE_DB_URL` - Direct database connection URL

## Production Considerations

1. **Rate Limiting**: Consider implementing rate limiting for POST endpoints
2. **Authentication**: Currently uses anonymous access; add auth for user-specific features
3. **Validation**: Server-side validation is basic; enhance for production
4. **Error Handling**: Comprehensive error logging is in place
5. **Image Storage**: Story images use Unsplash URLs; consider Supabase Storage for user uploads

## Extending the Backend

To add new endpoints, edit `/supabase/functions/server/index.tsx`:

```typescript
// New endpoint example
app.get("/make-server-f7350c8a/my-endpoint", async (c) => {
  try {
    const data = await kv.getByPrefix("my-prefix:");
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ success: false, error: "Error message" }, 500);
  }
});
```

Then add a corresponding function in `/src/app/utils/api.ts`:

```typescript
export async function fetchMyData() {
  return apiRequest('/my-endpoint');
}
```

## Troubleshooting

### Stories/Discussions not loading
- Check browser console for API errors
- Verify Supabase connection in Network tab
- Check that the server is running properly

### Submission not working
- Ensure all required fields are filled
- Check server logs in Supabase dashboard
- Verify CORS settings in server configuration

### Performance issues
- The KV store is optimized for fast reads
- Consider pagination for large datasets
- Use `getByPrefix` for efficient filtering
