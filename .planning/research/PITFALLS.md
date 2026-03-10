# Pitfalls Research: Social Media Feed

## Critical Pitfalls

### 1. Vercel Route Configuration Mismatch
- **Problem:** Vercel does NOT strip path prefixes. `/api/(.*)` passes the full `/api/...` URL to Express. If Express routes use relative paths (e.g., `router.get('/users')` mounted at `/api`), they won't match.
- **Warning Signs:** 404 errors on deployed app, works locally but not on Vercel
- **Prevention:** Express routes must use full paths OR use router mounting carefully. Test with `vercel dev` before deploying.
- **Phase:** 1 (project setup)

### 2. In-Memory State Reset on Vercel
- **Problem:** Vercel serverless functions are stateless — each invocation may get a fresh instance. In-memory data resets between cold starts.
- **Warning Signs:** Data disappearing after inactivity, seed data re-appearing
- **Prevention:** Accept this limitation for demo. Seed data on module initialization so every cold start has consistent data. Document that state is ephemeral.
- **Phase:** 1 (data store design)

### 3. Circular JSON References in Data Store
- **Problem:** If user objects reference post objects that reference user objects, JSON serialization breaks.
- **Warning Signs:** "Converting circular structure to JSON" errors
- **Prevention:** Store references as IDs, not object references. Resolve references at query time, not storage time.
- **Phase:** 1 (data store design)

### 4. Frontend Infinite Scroll Memory Leaks
- **Problem:** Appending DOM elements indefinitely without cleanup causes memory issues.
- **Warning Signs:** Page becomes slow after scrolling, high memory usage
- **Prevention:** Implement pagination in API (limit/offset), virtualize long lists or cap visible items.
- **Phase:** Frontend (phase 4-5)

### 5. Missing CORS/Content-Type Headers
- **Problem:** API endpoints returning JSON without proper Content-Type, or CORS issues when frontend and API are on same origin.
- **Warning Signs:** JSON parsing errors in browser, CORS errors in console
- **Prevention:** Set `Content-Type: application/json` on all API responses. Use `express.json()` middleware.
- **Phase:** 1 (Express setup)

### 6. Missing Current User Context
- **Problem:** Without auth, need a way to identify "current user" for feed, notifications, bookmarks.
- **Warning Signs:** Whose feed is shown? Whose notifications?
- **Prevention:** Pick a default "current user" from seed data (e.g., user 1). Allow switching via query param or header for demo purposes.
- **Phase:** 1 (design decision)

### 7. Hashtag Parsing Edge Cases
- **Problem:** Naive regex for #hashtags catches too much or too little (URLs, email addresses, punctuation)
- **Warning Signs:** Broken hashtag links, false positives
- **Prevention:** Use a well-tested regex: `/#(\w+)/g` and strip from URLs/emails first.
- **Phase:** 3 (hashtags)

---
*Researched: 2026-03-10*
