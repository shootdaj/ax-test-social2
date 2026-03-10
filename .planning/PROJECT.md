# ax-test-social2

## What This Is

A social media feed web application built with Node.js and deployed on Vercel. It provides a Twitter/Instagram-like experience with user profiles, posts with text and images, a feed from followed users, trending/explore features, likes, comments, notifications, hashtags, search, and bookmarks. Uses in-memory storage seeded with 5 users and 20 posts for demonstration.

## Core Value

Users can browse a clean, engaging social feed — viewing posts from people they follow, discovering trending content, and interacting through likes and comments — all with smooth animations and modern UI patterns.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User profiles with avatar, bio, follower/following counts
- [ ] Follow/unfollow users
- [ ] Create posts with text and optional image URL
- [ ] Feed showing posts from followed users (reverse chronological)
- [ ] Explore/trending page showing popular content
- [ ] Like posts with heart animation
- [ ] Comment on posts with slide-open panel
- [ ] In-app notifications with bell icon and badge count
- [ ] Hashtag support with clickable pills
- [ ] Search for users and posts
- [ ] Bookmark posts for later
- [ ] In-memory data store seeded with 5 users and 20 posts
- [ ] Clean light theme with card-based post layout
- [ ] Avatar circles for user identification
- [ ] Infinite scroll for feed
- [ ] Floating compose button
- [ ] Skeleton loading states
- [ ] Toast notifications for actions
- [ ] Profile page with stats (posts, followers, following)

### Out of Scope

- Real-time messaging/chat — complexity beyond demo scope
- Video/media upload — only image URLs supported
- Authentication/login — demo app with seeded data, no auth needed
- Database persistence — in-memory only for demonstration
- OAuth/third-party login — not needed for demo
- Email notifications — in-app only
- Admin panel/moderation — demo scope only
- Mobile native app — web-only

## Context

This is a demonstration/test project for the AX development framework. It exercises both backend API development and frontend UI implementation to validate AX's full lifecycle including the frontend design step. The app should look and feel like a real social media platform but uses in-memory storage for simplicity.

Technology stack:
- **Runtime:** Node.js
- **Framework:** Express.js
- **Frontend:** Server-rendered HTML with vanilla JS (no framework needed for this scope)
- **Deployment:** Vercel (serverless)
- **Storage:** In-memory JavaScript objects

## Constraints

- **Deployment:** Must deploy to Vercel as a serverless function
- **Storage:** In-memory only — no database
- **Seed Data:** Must include 5 users and 20 posts pre-loaded
- **Stack:** Node.js with Express
- **Entry Point:** `api/index.js` for Vercel, `src/app.js` for Express app

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| In-memory storage | Demo app, simplicity over persistence | — Pending |
| Vanilla JS frontend | No build step needed, simpler Vercel deployment | — Pending |
| Express.js | Lightweight, well-known, easy Vercel integration | — Pending |
| Server-rendered HTML | Single deployment unit, no separate frontend build | — Pending |

---
*Last updated: 2026-03-10 after initialization*
