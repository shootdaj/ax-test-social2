'use strict';

const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

let server;
let baseUrl;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const opts = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...options.headers }
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

describe('API Integration Tests', () => {
  before(async () => {
    // Reset store
    delete require.cache[require.resolve('../../src/data/store')];
    delete require.cache[require.resolve('../../src/data/seed')];
    delete require.cache[require.resolve('../../src/app')];
    const app = require('../../src/app');
    server = app.listen(0);
    const addr = server.address();
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  after(() => {
    if (server) server.close();
  });

  describe('Health', () => {
    it('GET /health returns 200', async () => {
      const res = await request('/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, 'ok');
    });
  });

  describe('Users', () => {
    it('GET /api/users returns all users', async () => {
      const res = await request('/api/users');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.length, 5);
    });

    it('GET /api/users/:id returns user profile', async () => {
      const usersRes = await request('/api/users');
      const userId = usersRes.body[0].id;
      const res = await request(`/api/users/${userId}`);
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.name);
      assert.ok('followerCount' in res.body);
      assert.ok('followingCount' in res.body);
      assert.ok('postCount' in res.body);
    });

    it('GET /api/users/nonexistent returns 404', async () => {
      const res = await request('/api/users/nonexistent');
      assert.strictEqual(res.status, 404);
    });
  });

  describe('Posts', () => {
    it('GET /api/posts returns all posts', async () => {
      const res = await request('/api/posts');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.length >= 20);
    });

    it('POST /api/posts creates a new post', async () => {
      const res = await request('/api/posts', {
        method: 'POST',
        body: { text: 'Test post #testing' }
      });
      assert.strictEqual(res.status, 201);
      assert.ok(res.body.id);
      assert.strictEqual(res.body.text, 'Test post #testing');
    });

    it('POST /api/posts with empty text returns 400', async () => {
      const res = await request('/api/posts', {
        method: 'POST',
        body: { text: '' }
      });
      assert.strictEqual(res.status, 400);
    });
  });

  describe('Feed', () => {
    it('GET /api/feed returns feed posts', async () => {
      const res = await request('/api/feed');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.posts));
      assert.ok('total' in res.body);
      assert.ok('limit' in res.body);
      assert.ok('offset' in res.body);
    });

    it('GET /api/feed supports pagination', async () => {
      const res = await request('/api/feed?limit=5&offset=0');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.posts.length <= 5);
    });

    it('GET /api/explore returns trending posts', async () => {
      const res = await request('/api/explore');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.posts));
    });
  });

  describe('Likes', () => {
    it('POST /api/posts/:id/like toggles like', async () => {
      const postsRes = await request('/api/posts');
      const postId = postsRes.body[0].id;
      const res = await request(`/api/posts/${postId}/like`, { method: 'POST' });
      assert.strictEqual(res.status, 200);
      assert.ok('liked' in res.body);
      assert.ok('likeCount' in res.body);
    });
  });

  describe('Comments', () => {
    it('POST /api/posts/:id/comments adds a comment', async () => {
      const postsRes = await request('/api/posts');
      const postId = postsRes.body[0].id;
      const res = await request(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: { text: 'Great post!' }
      });
      assert.strictEqual(res.status, 201);
      assert.ok(res.body.id);
    });

    it('GET /api/posts/:id/comments returns comments', async () => {
      const postsRes = await request('/api/posts');
      const postId = postsRes.body[0].id;
      const res = await request(`/api/posts/${postId}/comments`);
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body));
    });
  });

  describe('Bookmarks', () => {
    it('POST /api/posts/:id/bookmark toggles bookmark', async () => {
      const postsRes = await request('/api/posts');
      const postId = postsRes.body[0].id;
      const res = await request(`/api/posts/${postId}/bookmark`, { method: 'POST' });
      assert.strictEqual(res.status, 200);
      assert.ok('bookmarked' in res.body);
    });

    it('GET /api/bookmarks returns bookmarked posts', async () => {
      const res = await request('/api/bookmarks');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body));
    });
  });

  describe('Hashtags', () => {
    it('GET /api/hashtags/trending returns trending tags', async () => {
      const res = await request('/api/hashtags/trending');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body));
      assert.ok(res.body.length > 0);
    });

    it('GET /api/hashtags/:tag returns posts with tag', async () => {
      const trendingRes = await request('/api/hashtags/trending');
      const tag = trendingRes.body[0].tag;
      const res = await request(`/api/hashtags/${tag}`);
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body));
    });
  });

  describe('Search', () => {
    it('GET /api/search?q=sarah returns matching users and posts', async () => {
      const res = await request('/api/search?q=sarah');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.users));
      assert.ok(Array.isArray(res.body.posts));
    });

    it('GET /api/search with empty query returns empty results', async () => {
      const res = await request('/api/search?q=');
      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(res.body.users, []);
      assert.deepStrictEqual(res.body.posts, []);
    });
  });

  describe('Notifications', () => {
    it('GET /api/notifications returns notifications', async () => {
      const res = await request('/api/notifications');
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.notifications));
      assert.ok('unreadCount' in res.body);
    });

    it('POST /api/notifications/read marks notifications as read', async () => {
      const res = await request('/api/notifications/read', { method: 'POST' });
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.success);
    });
  });

  describe('Current User', () => {
    it('GET /api/me returns current user', async () => {
      const res = await request('/api/me');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.name);
      assert.ok(res.body.id);
    });
  });
});
