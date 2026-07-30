# Testing the Backend Integration

## Quick Start Testing

### 1. Verify Connection Status
- Look at the top navigation bar
- You should see a green "Connected" badge
- If you see "Offline", check the browser console for errors

### 2. Test Impact Stories

#### View Stories
1. Navigate to "Global Stories" in the sidebar
2. You should see a loading spinner, then 3 default stories appear:
   - "Preserving Indigenous Languages with AI"
   - "Sustainable Agriculture Networks"
   - "The Ethics of Open Knowledge"

#### Submit a New Story
1. Click "Contribute Story" button
2. Fill in the form:
   - Title: "Test Impact Story"
   - Category: "Testing"
   - Story: "This is a test story to verify backend integration."
3. Click "Submit Story"
4. You should see a success toast notification
5. The new story should appear in the list

#### Like a Story
1. Click the heart icon on any story
2. The like count should increment immediately
3. Refresh the page - the like count should persist

### 3. Test Collaboration Hub

#### View Discussions
1. Navigate to "Collaborate" in the sidebar
2. You should see 4 default discussions appear

#### Create a New Discussion
1. Click "Start New Topic" button
2. Fill in the form:
   - Title: "Test Discussion"
   - Tag: "Testing"
   - Description: "This is a test discussion."
3. Click "Create Discussion"
4. You should see a success toast notification
5. The new discussion should appear at the top of the list

### 4. Backend Verification

#### Check Server Logs
If you have access to the Supabase dashboard:
1. Go to Edge Functions
2. Select the server function
3. Check logs for:
   - Story created successfully
   - Discussion created successfully
   - GET/POST requests

#### Verify Data Persistence
1. Submit a story or discussion
2. Refresh the page completely
3. Navigate away and back to the page
4. Your submitted data should still be there

## Expected Behavior

### Loading States
- Components show a loading spinner while fetching data
- Forms show "Submitting..." or "Creating..." during submission

### Error Handling
- Network errors show toast notifications
- Server errors are logged to console
- Failed requests don't crash the app

### Data Initialization
- First load automatically seeds default data
- Subsequent loads use persisted data
- New submissions are added to existing data

## Common Issues and Solutions

### Issue: Stories/Discussions not loading
**Solution:**
1. Check browser console for errors
2. Verify connection status badge shows "Connected"
3. Check Network tab for failed requests
4. Ensure Supabase credentials are correct in `/utils/supabase/info.tsx`

### Issue: Submissions not persisting
**Solution:**
1. Check that you filled all required fields
2. Look for error toasts
3. Check server logs for error messages
4. Verify KV store is accessible

### Issue: Connection Status shows "Offline"
**Solution:**
1. Check that Supabase project is active
2. Verify the Edge Function is deployed
3. Check browser console for CORS errors
4. Ensure API_BASE_URL is correct in `/src/app/utils/api.ts`

### Issue: Duplicate default data on refresh
**Solution:**
- This shouldn't happen as initialization only runs when data is empty
- If it does, check the init-data endpoint logic
- Clear the KV store via Supabase dashboard

## Manual API Testing

You can test the API endpoints directly using curl or Postman:

### Health Check
```bash
curl https://jklewwlnrlzomkaetjjo.supabase.co/functions/v1/make-server-f7350c8a/health
```

### Get Stories
```bash
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  https://jklewwlnrlzomkaetjjo.supabase.co/functions/v1/make-server-f7350c8a/stories
```

### Submit Story
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"title":"Test","category":"Tech","story":"My story"}' \
  https://jklewwlnrlzomkaetjjo.supabase.co/functions/v1/make-server-f7350c8a/stories
```

## Browser Console Testing

Open the browser console and run:

```javascript
// Test health check
fetch('https://jklewwlnrlzomkaetjjo.supabase.co/functions/v1/make-server-f7350c8a/health')
  .then(r => r.json())
  .then(console.log);

// Import API functions (if in the app context)
import { fetchStories, submitStory } from '@/app/utils/api';

// Test fetching stories
const stories = await fetchStories();
console.log(stories);

// Test submitting a story
const result = await submitStory({
  title: "Console Test",
  category: "Testing",
  story: "Testing from console"
});
console.log(result);
```

## Performance Testing

### Load Testing
1. Submit multiple stories in quick succession
2. Verify all submissions succeed
3. Check that the list updates correctly

### Concurrent Users
1. Open the app in multiple browser tabs
2. Submit data from different tabs
3. Refresh all tabs - all data should be visible

### Network Conditions
1. Open DevTools Network tab
2. Throttle to "Slow 3G"
3. Test submissions - should work but slower
4. Loading states should remain visible longer

## Success Criteria

✅ Connection status shows "Connected"
✅ Default stories and discussions load on first visit
✅ New stories can be submitted and appear immediately
✅ New discussions can be created and appear immediately
✅ Like counts increment and persist
✅ Data survives page refreshes
✅ Loading states display during async operations
✅ Error messages appear for failed operations
✅ No console errors during normal operation

## Next Steps After Testing

Once testing is complete and successful:
1. Monitor server logs for any errors
2. Consider implementing user authentication
3. Add pagination for large datasets
4. Implement real-time updates with Supabase subscriptions
5. Add image upload capability for story submissions
6. Implement search functionality
7. Add analytics tracking
