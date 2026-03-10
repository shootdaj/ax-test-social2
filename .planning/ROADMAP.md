# Roadmap: ax-test-social2

**Created:** 2026-03-10
**Phases:** 6
**Requirements covered:** 37/37

## Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation & Data Store | Express app skeleton with in-memory store, seed data, Vercel deployment config | FOUND-01, FOUND-02, FOUND-03, FOUND-04 | 4 |
| 2 | User Profiles & Social Graph | User profiles with stats and follow/unfollow system | USER-01, USER-02, USER-03, USER-04 | 4 |
| 3 | Posts & Feed | Post creation, feed from followed users, explore/trending | POST-01, POST-02, POST-03, POST-04, FEED-01, FEED-02, FEED-03 | 5 |
| 4 | Engagement | Likes, comments, and bookmarks on posts | ENGM-01, ENGM-02, ENGM-03, ENGM-04, ENGM-05 | 4 |
| 5 | Discovery & Notifications | Hashtags, search, trending, and notification system | DISC-01, DISC-02, DISC-03, DISC-04, DISC-05, NOTF-01, NOTF-02, NOTF-03, NOTF-04, NOTF-05 | 5 |
| 6 | Frontend UI & Polish | Complete frontend with all visual elements, animations, and UX polish | UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07, UI-08, UI-09, UI-10, UI-11 | 5 |

---

## Phase 1: Foundation & Data Store

**Goal:** Set up the Express application skeleton with in-memory data store, seed data (5 users, 20 posts), health endpoint, and Vercel deployment configuration.

**Requirements:** FOUND-01, FOUND-02, FOUND-03, FOUND-04

**Success Criteria:**
1. `GET /health` returns 200 with `{"status": "ok"}`
2. Data store contains 5 users with name, avatar URL, and bio
3. Data store contains 20 posts with text, optional image URL, author reference, and timestamp
4. `vercel.json` and `api/index.js` exist and are correctly configured

**Build notes:**
- Initialize `package.json` with Express dependency
- Create `src/app.js` as the Express application
- Create `src/data/store.js` for in-memory data management
- Create `src/data/seed.js` with realistic sample data
- Create `api/index.js` as Vercel entry point
- Create `vercel.json` with correct routing

---

## Phase 2: User Profiles & Social Graph

**Goal:** Implement user profile endpoints and the follow/unfollow system. Set up a default "current user" for all interactions.

**Requirements:** USER-01, USER-02, USER-03, USER-04

**Success Criteria:**
1. `GET /api/users/:id` returns full profile with follower/following counts
2. `POST /api/users/:id/follow` creates a follow relationship
3. `DELETE /api/users/:id/follow` removes a follow relationship
4. A default current user is automatically set from seed data

**Build notes:**
- Create `src/routes/users.js` with profile and follow endpoints
- Add follower/following tracking to data store
- Use query parameter `?currentUser=<id>` or default to first seeded user
- Return 404 for non-existent users

---

## Phase 3: Posts & Feed

**Goal:** Implement post creation and the feed system — showing posts from followed users in reverse chronological order, with pagination support and an explore/trending page.

**Requirements:** POST-01, POST-02, POST-03, POST-04, FEED-01, FEED-02, FEED-03

**Success Criteria:**
1. `POST /api/posts` creates a post with text and optional image_url
2. `GET /api/feed` returns posts from followed users, newest first
3. `GET /api/feed?limit=10&offset=0` supports pagination
4. `GET /api/explore` returns posts sorted by engagement (likes + comments)
5. Posts include author info, timestamps, and interaction counts

**Build notes:**
- Create `src/routes/posts.js` for post CRUD
- Create `src/routes/feed.js` for feed and explore endpoints
- Implement pagination with limit/offset parameters
- Calculate engagement score for trending sort
- Include like_count, comment_count, is_liked, is_bookmarked on each post

---

## Phase 4: Engagement

**Goal:** Implement likes (toggle), comments, and bookmarks so users can interact with posts.

**Requirements:** ENGM-01, ENGM-02, ENGM-03, ENGM-04, ENGM-05

**Success Criteria:**
1. `POST /api/posts/:id/like` toggles like status and updates count
2. `POST /api/posts/:id/comments` adds a comment to a post
3. `GET /api/posts/:id/comments` returns all comments for a post
4. `POST /api/posts/:id/bookmark` toggles bookmark status

**Build notes:**
- Add likes, comments, and bookmarks collections to data store
- Create `src/routes/comments.js` for comment endpoints
- Add `GET /api/bookmarks` endpoint for viewing bookmarked posts
- Toggle behavior: calling like again unlikes, bookmark again unbookmarks

---

## Phase 5: Discovery & Notifications

**Goal:** Implement hashtag extraction, search, trending hashtags, and a full notification system for likes, comments, and follows.

**Requirements:** DISC-01, DISC-02, DISC-03, DISC-04, DISC-05, NOTF-01, NOTF-02, NOTF-03, NOTF-04, NOTF-05

**Success Criteria:**
1. Hashtags are extracted from post content on creation and stored
2. `GET /api/hashtags/:tag` returns posts containing that hashtag
3. `GET /api/search?q=term` returns matching users and posts
4. Notifications are created for likes, comments, and new followers
5. `GET /api/notifications` returns notifications with unread count

**Build notes:**
- Create `src/routes/hashtags.js` for hashtag endpoints
- Create `src/routes/search.js` for search functionality
- Create `src/routes/notifications.js` for notification system
- Extract hashtags with regex `/#(\w+)/g` on post creation
- Trending hashtags: sorted by usage count
- Generate notifications as side effects of like/comment/follow actions

---

## Phase 6: Frontend UI & Polish

**Goal:** Build the complete frontend with clean light theme, card-based layout, animations, and all UX features (infinite scroll, FAB, skeleton loading, toasts, etc.).

**Requirements:** UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07, UI-08, UI-09, UI-10, UI-11

**Success Criteria:**
1. Clean light theme with card-based post layout renders correctly
2. Heart animation plays on like, comments slide open, notification bell shows badge
3. Infinite scroll loads more posts, skeleton states show during loading
4. Floating compose button creates new posts via modal/form
5. All pages (feed, explore, profile, notifications, bookmarks) are navigable

**Build notes:**
- Create `src/views/index.html` as the app shell
- Create `src/public/css/styles.css` with full styling
- Create `src/public/js/app.js` with all client-side logic
- Serve static files via Express
- Use CSS animations for heart, slide-open, skeleton
- Use Intersection Observer for infinite scroll
- Toast system with auto-dismiss
- This phase has significant frontend/UI work — design input recommended

---
*Roadmap created: 2026-03-10*
