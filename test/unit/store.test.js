'use strict';

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');

describe('DataStore', () => {
  let store;

  beforeEach(() => {
    // Re-require to get fresh instance
    delete require.cache[require.resolve('../../src/data/store')];
    delete require.cache[require.resolve('../../src/data/seed')];
    store = require('../../src/data/store');
  });

  describe('Seed Data', () => {
    it('should have 5 seeded users', () => {
      const users = store.getAllUsers();
      assert.strictEqual(users.length, 5);
    });

    it('should have 20 seeded posts', () => {
      const posts = store.getAllPosts();
      assert.strictEqual(posts.length, 20);
    });

    it('should have a default user ID', () => {
      assert.ok(store.defaultUserId);
      const user = store.getUser(store.defaultUserId);
      assert.ok(user);
      assert.strictEqual(user.name, 'Sarah Chen');
    });

    it('users should have required fields', () => {
      const users = store.getAllUsers();
      for (const user of users) {
        assert.ok(user.id);
        assert.ok(user.name);
        assert.ok(user.username);
        assert.ok(user.avatar);
        assert.ok(user.bio);
      }
    });

    it('posts should have required fields', () => {
      const posts = store.getAllPosts();
      for (const post of posts) {
        assert.ok(post.id);
        assert.ok(post.authorId);
        assert.ok(post.text);
        assert.ok(post.createdAt);
        assert.ok(Array.isArray(post.hashtags));
      }
    });
  });

  describe('User Operations', () => {
    it('should get user by ID', () => {
      const user = store.getUser(store.defaultUserId);
      assert.ok(user);
      assert.strictEqual(user.name, 'Sarah Chen');
    });

    it('should return null for non-existent user', () => {
      const user = store.getUser('nonexistent');
      assert.strictEqual(user, null);
    });

    it('should get user profile with counts', () => {
      const profile = store.getUserProfile(store.defaultUserId, store.defaultUserId);
      assert.ok(profile);
      assert.ok('postCount' in profile);
      assert.ok('followerCount' in profile);
      assert.ok('followingCount' in profile);
      assert.ok('isFollowing' in profile);
    });
  });

  describe('Follow Operations', () => {
    it('should follow a user', () => {
      const users = store.getAllUsers();
      const target = users.find(u => u.id !== store.defaultUserId && !store.isFollowing(store.defaultUserId, u.id));
      if (target) {
        const result = store.follow(store.defaultUserId, target.id);
        assert.strictEqual(result, true);
        assert.strictEqual(store.isFollowing(store.defaultUserId, target.id), true);
      }
    });

    it('should not follow self', () => {
      const result = store.follow(store.defaultUserId, store.defaultUserId);
      assert.strictEqual(result, false);
    });

    it('should not double-follow', () => {
      const following = store.getFollowing(store.defaultUserId);
      if (following.length > 0) {
        const result = store.follow(store.defaultUserId, following[0]);
        assert.strictEqual(result, false);
      }
    });

    it('should unfollow a user', () => {
      const following = store.getFollowing(store.defaultUserId);
      if (following.length > 0) {
        const result = store.unfollow(store.defaultUserId, following[0]);
        assert.strictEqual(result, true);
        assert.strictEqual(store.isFollowing(store.defaultUserId, following[0]), false);
      }
    });
  });

  describe('Post Operations', () => {
    it('should create a post', () => {
      const post = store.createPost(store.defaultUserId, 'Hello #world');
      assert.ok(post.id);
      assert.strictEqual(post.authorId, store.defaultUserId);
      assert.strictEqual(post.text, 'Hello #world');
      assert.deepStrictEqual(post.hashtags, ['world']);
    });

    it('should get post with metadata', () => {
      const posts = store.getAllPosts();
      const enriched = store.getPostWithMeta(posts[0].id, store.defaultUserId);
      assert.ok(enriched);
      assert.ok(enriched.author);
      assert.ok('likeCount' in enriched);
      assert.ok('commentCount' in enriched);
      assert.ok('isLiked' in enriched);
      assert.ok('isBookmarked' in enriched);
    });
  });

  describe('Hashtag Operations', () => {
    it('should extract hashtags from posts', () => {
      const post = store.createPost(store.defaultUserId, 'Testing #foo and #bar');
      assert.deepStrictEqual(post.hashtags, ['foo', 'bar']);
    });

    it('should get trending hashtags', () => {
      const trending = store.getTrendingHashtags(5);
      assert.ok(Array.isArray(trending));
      assert.ok(trending.length > 0);
      assert.ok(trending[0].tag);
      assert.ok(trending[0].count > 0);
    });

    it('should get posts by hashtag', () => {
      const trending = store.getTrendingHashtags(1);
      if (trending.length > 0) {
        const posts = store.getPostsByHashtag(trending[0].tag, store.defaultUserId);
        assert.ok(posts.length > 0);
      }
    });
  });
});
