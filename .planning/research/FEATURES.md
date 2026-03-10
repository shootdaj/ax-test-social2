# Features Research: Social Media Feed

## Table Stakes (must have or users leave)

### User Profiles
- Display name, avatar, bio
- Follower/following counts
- User's post history on profile page
- **Complexity:** Low

### Posts
- Text content with optional image URL
- Timestamp display (relative: "2h ago")
- Author info (avatar, name) on each post
- **Complexity:** Low

### Feed
- Reverse chronological from followed users
- Card-based layout
- **Complexity:** Medium (requires follow graph)

### Social Interactions
- Like/unlike posts (toggle)
- Follow/unfollow users
- **Complexity:** Low

### Navigation
- Clear nav between feed, explore, profile, notifications
- **Complexity:** Low

## Differentiators (competitive advantage)

### Explore/Trending
- Posts sorted by engagement (likes + comments)
- Hashtag-based discovery
- **Complexity:** Medium

### Comments
- Threaded comments on posts
- Slide-open panel UX
- **Complexity:** Medium

### Notifications
- Bell icon with unread badge count
- Activity feed (likes, comments, follows)
- **Complexity:** Medium

### Hashtags
- Extract from post content (#tag)
- Clickable pills linking to filtered view
- **Complexity:** Low-Medium

### Search
- Search users by name
- Search posts by content/hashtag
- **Complexity:** Medium

### Bookmarks
- Save posts for later
- Bookmarks page/section
- **Complexity:** Low

### UI Polish
- Heart animation on like
- Infinite scroll
- Floating compose button (FAB)
- Skeleton loading states
- Toast notifications
- **Complexity:** Medium (CSS animations)

## Anti-Features (things to NOT build)
- Real-time WebSocket updates — unnecessary complexity for demo
- Direct messaging — separate feature domain
- Stories/reels — video complexity
- OAuth/SSO — no auth needed for demo
- Content moderation — demo scope
- Analytics dashboard — out of scope

## Feature Dependencies
```
Users → Follow System → Feed (requires follow graph)
Posts → Likes, Comments, Bookmarks (require post existence)
Posts → Hashtags → Explore (hashtag extraction feeds trending)
Likes/Comments/Follows → Notifications (activity generates notifications)
```

---
*Researched: 2026-03-10*
