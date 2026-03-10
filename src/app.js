'use strict';

const express = require('express');
const path = require('path');
const store = require('./data/store');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Helper: get current user from query param or default
function getCurrentUserId(req) {
  if (req.query.currentUser) {
    return req.query.currentUser;
  }
  return store.defaultUserId;
}

// Make getCurrentUserId available to routes
app.use((req, res, next) => {
  req.currentUserId = getCurrentUserId(req);
  next();
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- API Routes ---

// Users
app.get('/api/users/:id', (req, res) => {
  const profile = store.getUserProfile(req.params.id, req.currentUserId);
  if (!profile) return res.status(404).json({ error: 'User not found' });
  res.json(profile);
});

app.get('/api/users', (req, res) => {
  const users = store.getAllUsers().map(u => store.getUserProfile(u.id, req.currentUserId));
  res.json(users);
});

app.post('/api/users/:id/follow', (req, res) => {
  const targetUser = store.getUser(req.params.id);
  if (!targetUser) return res.status(404).json({ error: 'User not found' });

  const result = store.follow(req.currentUserId, req.params.id);
  if (!result) return res.status(400).json({ error: 'Already following or cannot follow self' });

  // Create notification
  store.addNotification(req.params.id, 'follow', req.currentUserId);
  res.json({ success: true, following: true });
});

app.delete('/api/users/:id/follow', (req, res) => {
  const result = store.unfollow(req.currentUserId, req.params.id);
  if (!result) return res.status(400).json({ error: 'Not following this user' });
  res.json({ success: true, following: false });
});

// Posts
app.get('/api/posts', (req, res) => {
  const posts = store.getAllPosts().map(p => store.getPostWithMeta(p.id, req.currentUserId));
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const { text, imageUrl } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });

  const post = store.createPost(req.currentUserId, text.trim(), imageUrl);
  const enriched = store.getPostWithMeta(post.id, req.currentUserId);
  res.status(201).json(enriched);
});

app.get('/api/posts/:id', (req, res) => {
  const post = store.getPostWithMeta(req.params.id, req.currentUserId);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// Feed
app.get('/api/feed', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  const feed = store.getFeed(req.currentUserId, limit, offset);
  res.json(feed);
});

// Explore / Trending
app.get('/api/explore', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  const explore = store.getExplore(limit, offset, req.currentUserId);
  res.json(explore);
});

// Likes
app.post('/api/posts/:id/like', (req, res) => {
  const post = store.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const result = store.toggleLike(req.currentUserId, req.params.id);

  // Create notification if liked (not unliked)
  if (result.liked) {
    store.addNotification(post.authorId, 'like', req.currentUserId, post.id);
  }

  const likeCount = store.likes.filter(l => l.postId === req.params.id).length;
  res.json({ ...result, likeCount });
});

// Comments
app.get('/api/posts/:id/comments', (req, res) => {
  const post = store.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const comments = store.getComments(req.params.id);
  res.json(comments);
});

app.post('/api/posts/:id/comments', (req, res) => {
  const post = store.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });

  const comment = store.addComment(req.params.id, req.currentUserId, text.trim());
  const author = store.getUser(req.currentUserId);
  const enriched = {
    ...comment,
    author: author ? { id: author.id, name: author.name, username: author.username, avatar: author.avatar } : null
  };

  // Create notification
  store.addNotification(post.authorId, 'comment', req.currentUserId, post.id);

  res.status(201).json(enriched);
});

// Bookmarks
app.post('/api/posts/:id/bookmark', (req, res) => {
  const post = store.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const result = store.toggleBookmark(req.currentUserId, req.params.id);
  res.json(result);
});

app.get('/api/bookmarks', (req, res) => {
  const bookmarks = store.getBookmarks(req.currentUserId);
  res.json(bookmarks);
});

// Hashtags
app.get('/api/hashtags/trending', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const trending = store.getTrendingHashtags(limit);
  res.json(trending);
});

app.get('/api/hashtags/:tag', (req, res) => {
  const posts = store.getPostsByHashtag(req.params.tag, req.currentUserId);
  res.json(posts);
});

// Search
app.get('/api/search', (req, res) => {
  const q = req.query.q;
  if (!q || !q.trim()) return res.json({ users: [], posts: [] });

  const users = store.searchUsers(q.trim()).map(u => store.getUserProfile(u.id, req.currentUserId));
  const posts = store.searchPosts(q.trim(), req.currentUserId);
  res.json({ users, posts });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const notifications = store.getNotifications(req.currentUserId);
  const unreadCount = store.getUnreadNotificationCount(req.currentUserId);
  res.json({ notifications, unreadCount });
});

app.post('/api/notifications/read', (req, res) => {
  const count = store.markNotificationsRead(req.currentUserId);
  res.json({ success: true, markedRead: count });
});

// Current user info
app.get('/api/me', (req, res) => {
  const profile = store.getUserProfile(req.currentUserId, req.currentUserId);
  if (!profile) return res.status(404).json({ error: 'Current user not found' });
  res.json(profile);
});

// Serve the main HTML page for all non-API routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Catch-all for non-matching routes
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

module.exports = app;
