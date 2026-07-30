# Backend Architecture Documentation

## Overview

This application uses Supabase for backend persistence with a three-tier architecture:

```
Frontend (React) → Edge Function (Hono Server) → Database (KV Store)
```

## Backend Components

### 1. Supabase Edge Function Server
Located at: `/supabase/functions/server/index.tsx`

The server is built with Hono.js and provides RESTful API endpoints for:
- **Impact Stories** - User-contributed stories with likes and comments
- **Discussions** - Community collaboration threads
- **Research Data** - Academic papers and research items
- **Knowledge Graph** - Node and connection data for visualizations

### 2. API Client
Located at: `/src/utils/api.ts`

Provides typed API methods for frontend components:
- `storiesApi` - CRUD operations for impact stories
- `discussionsApi` - CRUD operations for discussions
- `researchApi` - CRUD operations for research papers
- `graphApi` - Get/update knowledge graph data

### 3. Error Handling
Located at: `/src/utils/errorHandler.ts`

Centralized error handling utilities:
- `handleApiError()` - Converts errors to user-friendly messages
- `retryRequest()` - Automatic retry logic with exponential backoff
- `logError()` - Structured error logging

## API Endpoints

### Health Check
```
GET /make-server-f7350c8a/health
```

### Stories
```
GET  /make-server-f7350c8a/stories           # Get all stories
POST /make-server-f7350c8a/stories           # Create a story
POST /make-server-f7350c8a/stories/:id/like  # Like a story
```

### Discussions
```
GET  /make-server-f7350c8a/discussions       # Get all discussions
POST /make-server-f7350c8a/discussions       # Create a discussion
```

### Research
```
GET  /make-server-f7350c8a/research          # Get all research items
POST /make-server-f7350c8a/research          # Add a research item
```

### Knowledge Graph
```
GET /make-server-f7350c8a/graph-data         # Get graph data
PUT /make-server-f7350c8a/graph-data         # Update graph data
```

## Data Storage

The application uses Supabase's Key-Value store with prefixed keys:

- `story:*` - Impact stories
- `discussion:*` - Collaboration discussions
- `research:*` - Research papers
- `graph:main` - Knowledge graph data

Each record includes:
- Unique ID with timestamp
- Creation timestamp
- All relevant data fields
- Automatic sorting by creation date

## Error Handling Strategy

1. **Network Errors**: Retry with exponential backoff
2. **Client Errors (4xx)**: Display user-friendly message, no retry
3. **Server Errors (5xx)**: Log error, show generic message
4. **Fallback Data**: Components show default data when backend is unavailable

## Frontend Integration

Components use React hooks to fetch data:

```typescript
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const response = await storiesApi.getAll();
    if (response.success && response.data) {
      setData(response.data);
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to load data');
  } finally {
    setIsLoading(false);
  }
};
```

## Security Considerations

- All API requests use the public anonymous key
- CORS is enabled for all origins
- No authentication is currently implemented
- Data is not encrypted at rest (uses Supabase defaults)

## Future Enhancements

1. **Authentication** - Add user signup/login with Supabase Auth
2. **Real-time Updates** - Use Supabase subscriptions for live data
3. **File Uploads** - Integrate Supabase Storage for images/documents
4. **Search** - Add full-text search capabilities
5. **Analytics** - Track usage metrics and popular content
6. **Rate Limiting** - Prevent abuse with rate limits
7. **Data Validation** - Add schema validation on the server

## Troubleshooting

### Backend Not Responding
- Check Supabase project status
- Verify environment variables are set correctly
- Check browser console for CORS errors

### Data Not Persisting
- Verify KV store permissions
- Check server logs for errors
- Ensure proper error handling in frontend

### Slow Performance
- Check network latency to Supabase
- Consider adding caching layer
- Optimize data payload sizes

## Testing the Backend

You can test the API endpoints directly:

```bash
# Health check
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-f7350c8a/health

# Get stories
curl -H "Authorization: Bearer [ANON_KEY]" \
  https://[PROJECT_ID].supabase.co/functions/v1/make-server-f7350c8a/stories

# Create a story
curl -X POST \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","category":"Tech","story":"A test story"}' \
  https://[PROJECT_ID].supabase.co/functions/v1/make-server-f7350c8a/stories
```

## Monitoring

Monitor your backend through:
1. Supabase Dashboard → Edge Functions → Logs
2. Browser DevTools → Network tab
3. Console logs (enabled in development)

---

For questions or issues, review the server logs in the Supabase dashboard.
