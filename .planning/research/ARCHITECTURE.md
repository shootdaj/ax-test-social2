# Architecture Research: Social Media Feed

## System Structure

### Component Boundaries

```
┌─────────────────────────────────────────────────┐
│                   Express App                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Routes   │  │  Views   │  │   Static     │  │
│  │  (API)    │  │  (HTML)  │  │   (CSS/JS)   │  │
│  └────┬─────┘  └────┬─────┘  └──────────────┘  │
│       │              │                           │
│  ┌────┴──────────────┴─────┐                    │
│  │      Data Store         │                    │
│  │   (In-Memory Objects)   │                    │
│  └─────────────────────────┘                    │
└─────────────────────────────────────────────────┘
```

### Directory Layout
```
src/
  app.js              # Express app setup, middleware, route mounting
  routes/
    users.js          # /api/users — profiles, follow/unfollow
    posts.js          # /api/posts — CRUD, like, bookmark
    feed.js           # /api/feed — user feed, explore/trending
    comments.js       # /api/comments — add/list comments
    notifications.js  # /api/notifications — list, mark read
    search.js         # /api/search — users and posts
    hashtags.js       # /api/hashtags — trending, filter by tag
    pages.js          # / — serve HTML pages
  data/
    store.js          # In-memory data store with seed data
    seed.js           # 5 users, 20 posts seed data
  views/
    index.html        # Main SPA-like HTML shell
  public/
    css/
      styles.css      # All styles
    js/
      app.js          # Client-side JavaScript
api/
  index.js            # Vercel entry point
test/
  unit/               # Unit tests
  integration/        # Integration tests (API endpoints)
  scenarios/          # Scenario tests (user workflows)
```

### Data Flow
1. **Page Load:** Browser → Express → Serve HTML + CSS + JS
2. **API Calls:** Browser JS → fetch() → Express API routes → In-memory store → JSON response
3. **State Updates:** User action → API call → Store mutation → UI update (client JS)

### API Design
All API routes under `/api/`:
- `GET /api/users/:id` — user profile
- `POST /api/users/:id/follow` — follow user
- `DELETE /api/users/:id/follow` — unfollow user
- `GET /api/posts` — list posts
- `POST /api/posts` — create post
- `POST /api/posts/:id/like` — like/unlike toggle
- `POST /api/posts/:id/bookmark` — bookmark/unbookmark toggle
- `GET /api/posts/:id/comments` — list comments
- `POST /api/posts/:id/comments` — add comment
- `GET /api/feed` — posts from followed users
- `GET /api/explore` — trending posts
- `GET /api/notifications` — user notifications
- `POST /api/notifications/read` — mark notifications read
- `GET /api/search?q=term` — search users and posts
- `GET /api/hashtags/:tag` — posts with hashtag
- `GET /api/hashtags/trending` — trending hashtags
- `GET /health` — health check

### Build Order (dependency-driven)
1. **Data store + seed data + Express skeleton** — foundation
2. **User profiles + follow system** — social graph
3. **Posts + feed** — core content (depends on users + follows)
4. **Likes, comments, bookmarks** — engagement (depends on posts)
5. **Hashtags, search, explore/trending** — discovery (depends on posts + engagement)
6. **Notifications** — activity tracking (depends on all interactions)
7. **Frontend UI** — all the visual polish (depends on working API)

---
*Researched: 2026-03-10*
