# Requirements: ax-test-social2

**Defined:** 2026-03-10
**Core Value:** Users can browse a clean, engaging social feed — viewing posts from people they follow, discovering trending content, and interacting through likes and comments

## v1 Requirements

### Foundation

- [ ] **FOUND-01**: App serves a health endpoint at GET /health returning 200
- [ ] **FOUND-02**: In-memory data store initializes with 5 seeded users (name, avatar URL, bio)
- [ ] **FOUND-03**: In-memory data store initializes with 20 seeded posts (text, optional image URL, author, timestamp)
- [ ] **FOUND-04**: App deploys to Vercel via api/index.js entry point

### Users

- [ ] **USER-01**: User can view any user's profile (name, avatar, bio, post count, follower count, following count)
- [ ] **USER-02**: User can follow another user
- [ ] **USER-03**: User can unfollow a followed user
- [ ] **USER-04**: Default "current user" is set from seed data for all interactions

### Posts

- [ ] **POST-01**: User can create a new post with text content
- [ ] **POST-02**: User can create a post with text and an image URL
- [ ] **POST-03**: Posts display author avatar, name, relative timestamp, and content
- [ ] **POST-04**: Posts display like count, comment count, and bookmark status

### Feed

- [ ] **FEED-01**: User can view a feed of posts from followed users in reverse chronological order
- [ ] **FEED-02**: Feed supports pagination (limit/offset) for infinite scroll
- [ ] **FEED-03**: User can view an explore/trending page showing posts sorted by engagement

### Engagement

- [ ] **ENGM-01**: User can like a post (toggle — like/unlike)
- [ ] **ENGM-02**: User can comment on a post with text
- [ ] **ENGM-03**: User can view all comments on a post
- [ ] **ENGM-04**: User can bookmark a post for later (toggle)
- [ ] **ENGM-05**: User can view their bookmarked posts

### Discovery

- [ ] **DISC-01**: Hashtags in post content are automatically extracted and stored
- [ ] **DISC-02**: User can view all posts containing a specific hashtag
- [ ] **DISC-03**: User can view trending hashtags
- [ ] **DISC-04**: User can search for users by name
- [ ] **DISC-05**: User can search for posts by content

### Notifications

- [ ] **NOTF-01**: Notifications are generated for likes on user's posts
- [ ] **NOTF-02**: Notifications are generated for comments on user's posts
- [ ] **NOTF-03**: Notifications are generated when someone follows the user
- [ ] **NOTF-04**: User can view their notifications with unread count
- [ ] **NOTF-05**: User can mark notifications as read

### Frontend

- [ ] **UI-01**: Clean light theme with card-based post layout
- [ ] **UI-02**: Avatar circles for user identification throughout the app
- [ ] **UI-03**: Heart animation plays when liking a post
- [ ] **UI-04**: Infinite scroll loads more posts as user scrolls down
- [ ] **UI-05**: Floating compose button (FAB) for creating new posts
- [ ] **UI-06**: Comments slide open in a panel when clicked
- [ ] **UI-07**: Notification bell icon with unread badge count
- [ ] **UI-08**: Profile page displays user stats (posts, followers, following)
- [ ] **UI-09**: Hashtags render as clickable pills in post content
- [ ] **UI-10**: Skeleton loading states shown while content loads
- [ ] **UI-11**: Toast notifications appear for user actions (post created, liked, etc.)

## v2 Requirements

### Social

- **SOCL-01**: User can repost/share another user's post
- **SOCL-02**: User can mention other users with @username
- **SOCL-03**: User can send direct messages

### Moderation

- **MODR-01**: User can report inappropriate content
- **MODR-02**: User can block another user
- **MODR-03**: Admin can review and remove flagged content

## Out of Scope

| Feature | Reason |
|---------|--------|
| Authentication/login | Demo app with seeded data, no auth needed |
| Database persistence | In-memory only per requirements |
| Real-time WebSocket updates | Complexity beyond demo scope |
| Video/media upload | Only image URLs supported |
| Mobile native app | Web-only demo |
| Email notifications | In-app only |
| OAuth/SSO | No auth system |
| User registration | Pre-seeded users only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| USER-01 | Phase 2 | Pending |
| USER-02 | Phase 2 | Pending |
| USER-03 | Phase 2 | Pending |
| USER-04 | Phase 2 | Pending |
| POST-01 | Phase 3 | Pending |
| POST-02 | Phase 3 | Pending |
| POST-03 | Phase 3 | Pending |
| POST-04 | Phase 3 | Pending |
| FEED-01 | Phase 3 | Pending |
| FEED-02 | Phase 3 | Pending |
| FEED-03 | Phase 3 | Pending |
| ENGM-01 | Phase 4 | Pending |
| ENGM-02 | Phase 4 | Pending |
| ENGM-03 | Phase 4 | Pending |
| ENGM-04 | Phase 4 | Pending |
| ENGM-05 | Phase 4 | Pending |
| DISC-01 | Phase 5 | Pending |
| DISC-02 | Phase 5 | Pending |
| DISC-03 | Phase 5 | Pending |
| DISC-04 | Phase 5 | Pending |
| DISC-05 | Phase 5 | Pending |
| NOTF-01 | Phase 5 | Pending |
| NOTF-02 | Phase 5 | Pending |
| NOTF-03 | Phase 5 | Pending |
| NOTF-04 | Phase 5 | Pending |
| NOTF-05 | Phase 5 | Pending |
| UI-01 | Phase 6 | Pending |
| UI-02 | Phase 6 | Pending |
| UI-03 | Phase 6 | Pending |
| UI-04 | Phase 6 | Pending |
| UI-05 | Phase 6 | Pending |
| UI-06 | Phase 6 | Pending |
| UI-07 | Phase 6 | Pending |
| UI-08 | Phase 6 | Pending |
| UI-09 | Phase 6 | Pending |
| UI-10 | Phase 6 | Pending |
| UI-11 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 37
- Unmapped: 0

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-10 after initial definition*
