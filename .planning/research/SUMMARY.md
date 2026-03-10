# Research Summary: Social Media Feed

## Stack Decision
- **Node.js 20 + Express 4.x** — server-rendered HTML with vanilla JS, no build step
- **In-memory storage** — JavaScript objects with seed data (5 users, 20 posts)
- **Vercel deployment** — `@vercel/node` builder, `api/index.js` entry point
- **Node.js built-in test runner** — zero-dependency testing

## Table Stakes Features
- User profiles (avatar, bio, stats)
- Posts (text + image URL)
- Feed from followed users
- Like/unlike posts
- Follow/unfollow users
- Basic navigation

## Key Differentiators
- Explore/trending page
- Comments with slide-open panel
- Notifications with bell badge
- Hashtag pills and filtering
- Search (users + posts)
- Bookmarks
- UI polish: heart animation, infinite scroll, skeleton loading, FAB compose, toasts

## Critical Watch-Outs
1. **Vercel routing** — routes must use full paths, Vercel does NOT strip prefixes
2. **Cold start state reset** — in-memory data resets on Vercel cold starts, seed on init
3. **Circular JSON** — store IDs not object references
4. **Current user context** — use default user from seed data, allow switching
5. **Hashtag parsing** — use tested regex, handle edge cases

## Recommended Phase Structure
1. Foundation: Express skeleton, data store, seed data, Vercel setup
2. Core Social: Users, profiles, follow system
3. Content: Posts, feed, likes, comments, bookmarks
4. Discovery: Hashtags, search, explore/trending, notifications
5. Frontend: Full UI implementation with all polish

---
*Synthesized: 2026-03-10*
