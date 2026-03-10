'use strict';

const { generateSeedData } = require('./seed');

class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    const seed = generateSeedData();
    this.users = new Map(seed.users.map(u => [u.id, u]));
    this.posts = new Map(seed.posts.map(p => [p.id, p]));
    this.follows = seed.follows; // Array of { followerId, followingId }
    this.likes = seed.likes;     // Array of { userId, postId }
    this.comments = seed.comments; // Array of { id, postId, authorId, text, createdAt }
    this.bookmarks = [];          // Array of { userId, postId }
    this.notifications = seed.notifications; // Array of { id, userId, type, actorId, postId, read, createdAt }
    this.defaultUserId = seed.defaultUserId;
  }

  // --- Users ---

  getUser(id) {
    return this.users.get(id) || null;
  }

  getUserByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) return user;
    }
    return null;
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  getUserProfile(userId, currentUserId) {
    const user = this.getUser(userId);
    if (!user) return null;

    const postCount = this.getPostsByAuthor(userId).length;
    const followerCount = this.getFollowers(userId).length;
    const followingCount = this.getFollowing(userId).length;
    const isFollowing = currentUserId ? this.isFollowing(currentUserId, userId) : false;

    return {
      ...user,
      postCount,
      followerCount,
      followingCount,
      isFollowing
    };
  }

  // --- Follows ---

  isFollowing(followerId, followingId) {
    return this.follows.some(f => f.followerId === followerId && f.followingId === followingId);
  }

  follow(followerId, followingId) {
    if (followerId === followingId) return false;
    if (this.isFollowing(followerId, followingId)) return false;
    this.follows.push({ followerId, followingId });
    return true;
  }

  unfollow(followerId, followingId) {
    const idx = this.follows.findIndex(f => f.followerId === followerId && f.followingId === followingId);
    if (idx === -1) return false;
    this.follows.splice(idx, 1);
    return true;
  }

  getFollowers(userId) {
    return this.follows.filter(f => f.followingId === userId).map(f => f.followerId);
  }

  getFollowing(userId) {
    return this.follows.filter(f => f.followerId === userId).map(f => f.followingId);
  }

  // --- Posts ---

  getPost(id) {
    return this.posts.get(id) || null;
  }

  getAllPosts() {
    return Array.from(this.posts.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getPostsByAuthor(authorId) {
    return Array.from(this.posts.values())
      .filter(p => p.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createPost(authorId, text, imageUrl) {
    const { v4: uuidv4 } = require('uuid');
    const hashtags = (text.match(/#(\w+)/g) || []).map(t => t.slice(1).toLowerCase());
    const post = {
      id: uuidv4(),
      authorId,
      text,
      imageUrl: imageUrl || null,
      createdAt: new Date().toISOString(),
      hashtags
    };
    this.posts.set(post.id, post);
    return post;
  }

  getPostWithMeta(postId, currentUserId) {
    const post = this.getPost(postId);
    if (!post) return null;
    return this._enrichPost(post, currentUserId);
  }

  _enrichPost(post, currentUserId) {
    const author = this.getUser(post.authorId);
    const likeCount = this.likes.filter(l => l.postId === post.id).length;
    const commentCount = this.comments.filter(c => c.postId === post.id).length;
    const isLiked = currentUserId ? this.likes.some(l => l.postId === post.id && l.userId === currentUserId) : false;
    const isBookmarked = currentUserId ? this.bookmarks.some(b => b.postId === post.id && b.userId === currentUserId) : false;

    return {
      ...post,
      author: author ? { id: author.id, name: author.name, username: author.username, avatar: author.avatar } : null,
      likeCount,
      commentCount,
      isLiked,
      isBookmarked
    };
  }

  // --- Feed ---

  getFeed(userId, limit = 20, offset = 0) {
    const following = this.getFollowing(userId);
    const feedPosts = Array.from(this.posts.values())
      .filter(p => following.includes(p.authorId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(offset, offset + limit);

    return {
      posts: feedPosts.map(p => this._enrichPost(p, userId)),
      total: Array.from(this.posts.values()).filter(p => following.includes(p.authorId)).length,
      limit,
      offset
    };
  }

  getExplore(limit = 20, offset = 0, currentUserId) {
    const postsWithScore = Array.from(this.posts.values()).map(p => {
      const likeCount = this.likes.filter(l => l.postId === p.id).length;
      const commentCount = this.comments.filter(c => c.postId === p.id).length;
      return { post: p, score: likeCount + commentCount * 2 };
    });

    postsWithScore.sort((a, b) => b.score - a.score);
    const sliced = postsWithScore.slice(offset, offset + limit);

    return {
      posts: sliced.map(ps => this._enrichPost(ps.post, currentUserId)),
      total: postsWithScore.length,
      limit,
      offset
    };
  }

  // --- Likes ---

  toggleLike(userId, postId) {
    const idx = this.likes.findIndex(l => l.userId === userId && l.postId === postId);
    if (idx === -1) {
      this.likes.push({ userId, postId });
      return { liked: true };
    }
    this.likes.splice(idx, 1);
    return { liked: false };
  }

  // --- Comments ---

  addComment(postId, authorId, text) {
    const { v4: uuidv4 } = require('uuid');
    const comment = {
      id: uuidv4(),
      postId,
      authorId,
      text,
      createdAt: new Date().toISOString()
    };
    this.comments.push(comment);
    return comment;
  }

  getComments(postId) {
    return this.comments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(c => {
        const author = this.getUser(c.authorId);
        return {
          ...c,
          author: author ? { id: author.id, name: author.name, username: author.username, avatar: author.avatar } : null
        };
      });
  }

  // --- Bookmarks ---

  toggleBookmark(userId, postId) {
    const idx = this.bookmarks.findIndex(b => b.userId === userId && b.postId === postId);
    if (idx === -1) {
      this.bookmarks.push({ userId, postId });
      return { bookmarked: true };
    }
    this.bookmarks.splice(idx, 1);
    return { bookmarked: false };
  }

  getBookmarks(userId) {
    const bookmarkedPostIds = this.bookmarks
      .filter(b => b.userId === userId)
      .map(b => b.postId);
    return bookmarkedPostIds
      .map(id => this.getPost(id))
      .filter(Boolean)
      .map(p => this._enrichPost(p, userId));
  }

  // --- Hashtags ---

  getPostsByHashtag(tag, currentUserId) {
    const normalizedTag = tag.toLowerCase();
    return Array.from(this.posts.values())
      .filter(p => p.hashtags && p.hashtags.includes(normalizedTag))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(p => this._enrichPost(p, currentUserId));
  }

  getTrendingHashtags(limit = 10) {
    const tagCounts = {};
    for (const post of this.posts.values()) {
      if (post.hashtags) {
        for (const tag of post.hashtags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }
    }
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // --- Search ---

  searchUsers(query) {
    const q = query.toLowerCase();
    return Array.from(this.users.values())
      .filter(u => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q));
  }

  searchPosts(query, currentUserId) {
    const q = query.toLowerCase();
    return Array.from(this.posts.values())
      .filter(p => p.text.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(p => this._enrichPost(p, currentUserId));
  }

  // --- Notifications ---

  addNotification(userId, type, actorId, postId = null) {
    const { v4: uuidv4 } = require('uuid');
    // Don't notify yourself
    if (userId === actorId) return null;
    const notification = {
      id: uuidv4(),
      userId,
      type,
      actorId,
      postId,
      read: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.push(notification);
    return notification;
  }

  getNotifications(userId) {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(n => {
        const actor = this.getUser(n.actorId);
        return {
          ...n,
          actor: actor ? { id: actor.id, name: actor.name, username: actor.username, avatar: actor.avatar } : null
        };
      });
  }

  getUnreadNotificationCount(userId) {
    return this.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  markNotificationsRead(userId) {
    let count = 0;
    for (const n of this.notifications) {
      if (n.userId === userId && !n.read) {
        n.read = true;
        count++;
      }
    }
    return count;
  }
}

// Singleton instance
const store = new DataStore();

module.exports = store;
