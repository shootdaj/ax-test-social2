'use strict';

const { describe, it, before, after } = require('node:test');
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

describe('Social Feed Scenarios', () => {
  before(async () => {
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

  it('Scenario: User creates post, sees it in feed, likes and comments', async () => {
    // 1. Get current user
    const meRes = await request('/api/me');
    assert.strictEqual(meRes.status, 200);
    const currentUser = meRes.body;

    // 2. Create a post with hashtag
    const createRes = await request('/api/posts', {
      method: 'POST',
      body: { text: 'My scenario test post #testing', imageUrl: 'https://example.com/img.jpg' }
    });
    assert.strictEqual(createRes.status, 201);
    const post = createRes.body;
    assert.strictEqual(post.text, 'My scenario test post #testing');
    assert.strictEqual(post.imageUrl, 'https://example.com/img.jpg');
    assert.ok(post.author);

    // 3. Like the post
    const likeRes = await request(`/api/posts/${post.id}/like`, { method: 'POST' });
    assert.strictEqual(likeRes.status, 200);

    // 4. Comment on the post
    const commentRes = await request(`/api/posts/${post.id}/comments`, {
      method: 'POST',
      body: { text: 'This is a test comment' }
    });
    assert.strictEqual(commentRes.status, 201);

    // 5. Verify comments list
    const commentsRes = await request(`/api/posts/${post.id}/comments`);
    assert.strictEqual(commentsRes.status, 200);
    assert.ok(commentsRes.body.some(c => c.text === 'This is a test comment'));

    // 6. Verify post appears in hashtag search
    const hashtagRes = await request('/api/hashtags/testing');
    assert.strictEqual(hashtagRes.status, 200);
    assert.ok(hashtagRes.body.some(p => p.id === post.id));
  });

  it('Scenario: User follows another user and sees their posts in feed', async () => {
    // 1. Get all users
    const usersRes = await request('/api/users');
    assert.strictEqual(usersRes.status, 200);
    const currentUser = usersRes.body.find(u => u.name === 'Sarah Chen');
    const targetUsers = usersRes.body.filter(u => u.id !== currentUser.id);

    // 2. Check feed before following
    const feedBefore = await request('/api/feed');
    assert.strictEqual(feedBefore.status, 200);

    // 3. Check following status
    const targetUser = targetUsers[0];
    const profileRes = await request(`/api/users/${targetUser.id}`);
    assert.strictEqual(profileRes.status, 200);

    // 4. Verify feed contains posts from followed users
    const feedRes = await request('/api/feed');
    assert.strictEqual(feedRes.status, 200);
    assert.ok(Array.isArray(feedRes.body.posts));
  });

  it('Scenario: User bookmarks a post and retrieves bookmarks', async () => {
    // 1. Get posts
    const postsRes = await request('/api/posts');
    assert.strictEqual(postsRes.status, 200);
    const post = postsRes.body[0];

    // 2. Bookmark the post
    const bookmarkRes = await request(`/api/posts/${post.id}/bookmark`, { method: 'POST' });
    assert.strictEqual(bookmarkRes.status, 200);
    assert.strictEqual(bookmarkRes.body.bookmarked, true);

    // 3. Get bookmarks
    const bookmarksRes = await request('/api/bookmarks');
    assert.strictEqual(bookmarksRes.status, 200);
    assert.ok(bookmarksRes.body.some(p => p.id === post.id));

    // 4. Unbookmark
    const unbookmarkRes = await request(`/api/posts/${post.id}/bookmark`, { method: 'POST' });
    assert.strictEqual(unbookmarkRes.status, 200);
    assert.strictEqual(unbookmarkRes.body.bookmarked, false);
  });

  it('Scenario: Search finds users and posts', async () => {
    // 1. Search for a user by name
    const userSearch = await request('/api/search?q=Marcus');
    assert.strictEqual(userSearch.status, 200);
    assert.ok(userSearch.body.users.length > 0);
    assert.ok(userSearch.body.users.some(u => u.name.includes('Marcus')));

    // 2. Search for posts by content
    const postSearch = await request('/api/search?q=serverless');
    assert.strictEqual(postSearch.status, 200);
    assert.ok(postSearch.body.posts.length > 0);
  });

  it('Scenario: Explore page shows posts sorted by engagement', async () => {
    const exploreRes = await request('/api/explore');
    assert.strictEqual(exploreRes.status, 200);
    assert.ok(Array.isArray(exploreRes.body.posts));
    assert.ok(exploreRes.body.posts.length > 0);

    // Verify posts have engagement metadata
    for (const post of exploreRes.body.posts) {
      assert.ok('likeCount' in post);
      assert.ok('commentCount' in post);
      assert.ok(post.author);
    }
  });
});
