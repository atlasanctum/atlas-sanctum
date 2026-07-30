# Global Knowledge Ecosystem - Backend API Documentation

This directory contains the Supabase Edge Function server that provides backend persistence for the Global Knowledge Ecosystem dashboard.

## Architecture

The backend uses a three-tier architecture:
```
Frontend (React) -> Server (Hono/Deno) -> Database (Supabase KV Store)
```

## Server Configuration

- **Runtime**: Deno
- **Framework**: Hono
- **Database**: Supabase Key-Value Store
- **CORS**: Enabled for all origins
- **Logging**: Console logging enabled for debugging

## API Endpoints

### Health Check
- `GET /make-server-f7350c8a/health`
- Returns server status

### Database Seeding
- `POST /make-server-f7350c8a/seed`
- Initializes database with sample data
- Called automatically on first app load

### Stories API

#### Get All Stories
- `GET /make-server-f7350c8a/stories`
- Returns all impact stories, sorted by creation date (newest first)
- Response: `{ success: boolean, data: Story[] }`

#### Get Story by ID
- `GET /make-server-f7350c8a/stories/:id`
- Returns a single story by ID
- Response: `{ success: boolean, data: Story }`

#### Create Story
- `POST /make-server-f7350c8a/stories`
- Creates a new impact story
- Body: `{ title: string, category: string, story: string, author?: string }`
- Response: `{ success: boolean, data: Story, message: string }`

#### Update Story
- `PATCH /make-server-f7350c8a/stories/:id`
- Updates an existing story (e.g., increment likes)
- Body: Partial Story object
- Response: `{ success: boolean, data: Story }`

### Discussions API

#### Get All Discussions
- `GET /make-server-f7350c8a/discussions`
- Returns all collaboration discussions
- Response: `{ success: boolean, data: Discussion[] }`

#### Create Discussion
- `POST /make-server-f7350c8a/discussions`
- Creates a new discussion thread
- Body: `{ title: string, content: string, author?: string, tag?: string }`
- Response: `{ success: boolean, data: Discussion, message: string }`

### Research API

#### Get Research Nodes
- `GET /make-server-f7350c8a/research/nodes`
- Returns all research nodes for the knowledge graph
- Response: `{ success: boolean, data: ResearchNode[] }`

#### Create Research Node
- `POST /make-server-f7350c8a/research/nodes`
- Creates a new research node
- Body: `{ label: string, category: string, connections?: string[] }`
- Response: `{ success: boolean, data: ResearchNode }`

## Data Models

### Story
```typescript
{
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  image: string;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}
```

### Discussion
```typescript
{
  id: string;
  title: string;
  content: string;
  author: string;
  authorImage: string;
  tag: string;
  replies: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}
```

### ResearchNode
```typescript
{
  id: string;
  label: string;
  category: string;
  connections: string[];
  createdAt: string;
}
```

## Error Handling

All endpoints return errors in a consistent format:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema

Data is stored in the `kv_store_f7350c8a` table using key prefixes:
- `story:*` - Impact stories
- `discussion:*` - Collaboration discussions
- `research_node:*` - Knowledge graph nodes

## Frontend Integration

The frontend uses the API client at `/src/app/utils/api.ts` which provides typed interfaces for all endpoints.

Example usage:
```typescript
import { storiesApi } from '@/app/utils/api';

const response = await storiesApi.create({
  title: "My Impact Story",
  category: "Environment",
  story: "This is my story..."
});

if (response.success) {
  console.log('Story created:', response.data);
}
```

## Development

To add new endpoints:
1. Add route handler in `index.tsx`
2. Update seed data in `seed.tsx` if needed
3. Add corresponding API function in frontend `/src/app/utils/api.ts`
4. Update this documentation

## Logging

The server logs all requests and includes detailed error messages. Check the Supabase Edge Function logs for debugging.

## Security Notes

- All routes are protected with CORS headers
- The `SUPABASE_SERVICE_ROLE_KEY` is only used server-side
- The frontend uses the `SUPABASE_ANON_KEY` for authentication
- Input validation is performed on all POST/PATCH endpoints
