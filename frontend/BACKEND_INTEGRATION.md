# Backend Integration Guide

## 🔗 Connecting to Your Render Backend

### Step 1: Find Your Render Backend URL

1. Go to your Render dashboard
2. Find your Junior News Digest backend service
3. Copy the service URL (should look like: `https://your-service-name.onrender.com`)

### Step 2: Update API Configuration

Edit `src/config/api.ts` and replace the production URL:

```typescript
export const API_CONFIG: ApiConfig = {
  baseUrl: isDevelopment 
    ? 'http://localhost:5000' // Local development
    : 'https://YOUR-ACTUAL-RENDER-URL.onrender.com', // 👈 Replace this
  // ... rest of config
};
```

### Step 3: Test the Connection

1. **Add the test screen to your app temporarily:**
   
   In `App.tsx`, import and add the test screen:
   ```typescript
   import { ApiTestScreen } from './src/components/ApiTestScreen';
   
   // Add this to your renderScreen function for testing:
   if (activeTab === 'test') {
     return <ApiTestScreen />;
   }
   ```

2. **Test the backend connection:**
   - Open the app
   - Navigate to the test screen
   - Check if "Backend Online" shows up
   - Run the manual API tests

### Step 4: Backend Requirements

Make sure your Render backend has these endpoints working:

#### ✅ Required Endpoints:
- `GET /health` - Health check
- `GET /api/articles` - List articles
- `GET /api/articles/:id` - Get single article  
- `GET /api/articles/:id/quiz` - Get article quiz
- `GET /api/videos` - List videos
- `GET /api/search` - Search content

#### 📋 Expected Response Formats:

**Articles Response:**
```json
{
  "articles": [
    {
      "id": "1",
      "title": "Amazing Science Discovery",
      "headline": "Scientists make breakthrough",
      "content": "Full article content...",
      "summary": "Short summary...",
      "category": "science",
      "author": "Dr. Smith",
      "published_date": "2024-01-15",
      "read_time": "3 min read",
      "likes": 150,
      "views": 1200,
      "comments": 25,
      "is_breaking": false,
      "is_trending": true,
      "is_hot": false,
      "video_url": "https://...",
      "thumbnail_url": "https://...",
      "quiz_id": "quiz1"
    }
  ],
  "total": 50
}
```

**Videos Response:**
```json
{
  "videos": [
    {
      "id": "1",
      "title": "Amazing Science Video",
      "url": "https://...",
      "thumbnail_url": "https://...",
      "duration": "3:45",
      "category": "science",
      "views": 1500,
      "upload_date": "2024-01-15",
      "status": "ready"
    }
  ],
  "total": 25
}
```

### Step 5: Update Screens to Use Real Data

Once the backend is connected, update the main screens:

1. **Home Screen:** Replace mock data with `useArticles()` hook
2. **Videos Screen:** Replace mock data with `useVideos()` hook  
3. **Search Screen:** Replace mock data with `useSearch()` hook
4. **Bookmarks Screen:** Connect to backend bookmarks

### Step 6: Environment Variables (Optional)

For production, you can use environment variables:

1. Create `.env` file:
   ```
   EXPO_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

2. Update `api.ts`:
   ```typescript
   baseUrl: process.env.EXPO_PUBLIC_API_URL || 'fallback-url'
   ```

## 🚀 Quick Integration Checklist

- [ ] Found Render backend URL
- [ ] Updated `src/config/api.ts` with real URL
- [ ] Backend health check passes
- [ ] Articles API returns data
- [ ] Videos API returns data
- [ ] Search API works
- [ ] Updated home screen to use real data
- [ ] Updated videos screen to use real data
- [ ] Removed test components

## 🔧 Troubleshooting

### Backend Not Responding
- Check if your Render service is running
- Verify the URL is correct
- Check Render logs for errors

### CORS Issues
- Make sure backend allows requests from app
- Check `Access-Control-Allow-Origin` headers

### Data Format Issues
- Verify backend returns expected JSON structure
- Check field names match exactly
- Ensure data types are correct

### Performance Issues
- Enable caching on backend
- Implement pagination for large datasets
- Add loading states in the app

## 📱 Ready for Production

Once everything is connected and tested:

1. Remove the `ApiTestScreen` component
2. Update all screens to use real data
3. Add proper error handling
4. Implement offline caching
5. Add analytics tracking
6. Test on physical devices

Your app will then be fully connected to the live backend and ready for app store submission!
