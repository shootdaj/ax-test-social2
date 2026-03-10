'use strict';

const { v4: uuidv4 } = require('uuid');

function generateSeedData() {
  const userIds = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];

  const users = [
    {
      id: userIds[0],
      name: 'Sarah Chen',
      username: 'sarahchen',
      avatar: 'https://i.pravatar.cc/150?u=sarahchen',
      bio: 'Full-stack developer & coffee enthusiast. Building things that matter.',
      createdAt: '2026-02-01T10:00:00Z'
    },
    {
      id: userIds[1],
      name: 'Marcus Johnson',
      username: 'marcusj',
      avatar: 'https://i.pravatar.cc/150?u=marcusj',
      bio: 'Designer turned developer. Pixel-perfect or nothing.',
      createdAt: '2026-02-02T11:00:00Z'
    },
    {
      id: userIds[2],
      name: 'Priya Patel',
      username: 'priyap',
      avatar: 'https://i.pravatar.cc/150?u=priyap',
      bio: 'Data scientist by day, photographer by weekend. Love hiking.',
      createdAt: '2026-02-03T09:00:00Z'
    },
    {
      id: userIds[3],
      name: 'Alex Rivera',
      username: 'alexr',
      avatar: 'https://i.pravatar.cc/150?u=alexr',
      bio: 'Open source contributor. Rust, Go, and everything systems.',
      createdAt: '2026-02-04T14:00:00Z'
    },
    {
      id: userIds[4],
      name: 'Jordan Kim',
      username: 'jordank',
      avatar: 'https://i.pravatar.cc/150?u=jordank',
      bio: 'Product manager & startup advisor. Shipping fast, learning faster.',
      createdAt: '2026-02-05T08:00:00Z'
    }
  ];

  const postTexts = [
    { text: 'Just deployed my first #serverless app on Vercel. The DX is incredible! #webdev', authorIdx: 0, imageUrl: 'https://picsum.photos/seed/post1/600/400' },
    { text: 'Hot take: CSS Grid is underrated. Stop reaching for flexbox for everything. #css #frontend', authorIdx: 1, imageUrl: null },
    { text: 'Captured this amazing sunset during my hike yesterday. Nature never disappoints. #photography #hiking', authorIdx: 2, imageUrl: 'https://picsum.photos/seed/post3/600/400' },
    { text: 'Been experimenting with Rust for web services. The compile times are worth it for the safety guarantees. #rust #programming', authorIdx: 3, imageUrl: null },
    { text: 'Three things that make a great product: simplicity, speed, and reliability. Everything else is secondary. #product #startup', authorIdx: 4, imageUrl: null },
    { text: 'Code review tip: review the tests first. They tell you what the code should do. #bestpractices #engineering', authorIdx: 0, imageUrl: null },
    { text: 'New design system is coming together nicely. Consistency is everything in UI. #design #ux', authorIdx: 1, imageUrl: 'https://picsum.photos/seed/post7/600/400' },
    { text: 'Just finished a 10-day #machinelearning course. The math is hard but the applications are fascinating. #datascience', authorIdx: 2, imageUrl: null },
    { text: 'Opened my 100th PR on GitHub today. Open source has taught me more than any job. #opensource #github', authorIdx: 3, imageUrl: null },
    { text: 'Attended an amazing tech meetup tonight. The community here is something special. #community #tech', authorIdx: 4, imageUrl: 'https://picsum.photos/seed/post10/600/400' },
    { text: 'Debugging a production issue at 2am. Coffee count: 4. Bug count: still 1. #devlife', authorIdx: 0, imageUrl: null },
    { text: 'Typography tip: increase your line-height. Your users\' eyes will thank you. #typography #design', authorIdx: 1, imageUrl: null },
    { text: 'Dataset of 10M images processed in 3 hours. Cloud computing is wild. #cloud #data', authorIdx: 2, imageUrl: null },
    { text: 'Just released v2.0 of my CLI tool. 500 stars and counting! #golang #cli #opensource', authorIdx: 3, imageUrl: 'https://picsum.photos/seed/post14/600/400' },
    { text: 'The best feature you can ship is the one that removes complexity. Less is more. #product', authorIdx: 4, imageUrl: null },
    { text: 'Built a real-time dashboard with WebSockets today. Seeing data flow live is so satisfying. #webdev #javascript', authorIdx: 0, imageUrl: 'https://picsum.photos/seed/post16/600/400' },
    { text: 'Color palette for the new project. Going with warm neutrals and a bold accent. Thoughts? #colortheory #design', authorIdx: 1, imageUrl: 'https://picsum.photos/seed/post17/600/400' },
    { text: 'Morning run in the park, then straight to coding. Best way to start the day. #fitness #coding', authorIdx: 2, imageUrl: 'https://picsum.photos/seed/post18/600/400' },
    { text: 'Memory safety isn\'t optional. It\'s a feature your users deserve. #security #rust', authorIdx: 3, imageUrl: null },
    { text: 'Shipped three features this week. Moving fast without breaking things is an art. #startup #shipping', authorIdx: 4, imageUrl: null }
  ];

  const now = new Date('2026-03-10T12:00:00Z');
  const posts = postTexts.map((p, i) => {
    const hoursAgo = (postTexts.length - i) * 3;
    const createdAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();
    return {
      id: uuidv4(),
      authorId: userIds[p.authorIdx],
      text: p.text,
      imageUrl: p.imageUrl,
      createdAt,
      hashtags: (p.text.match(/#(\w+)/g) || []).map(t => t.slice(1).toLowerCase())
    };
  });

  // Set up some follow relationships
  const follows = [
    { followerId: userIds[0], followingId: userIds[1] },
    { followerId: userIds[0], followingId: userIds[2] },
    { followerId: userIds[0], followingId: userIds[4] },
    { followerId: userIds[1], followingId: userIds[0] },
    { followerId: userIds[1], followingId: userIds[3] },
    { followerId: userIds[2], followingId: userIds[0] },
    { followerId: userIds[2], followingId: userIds[1] },
    { followerId: userIds[2], followingId: userIds[3] },
    { followerId: userIds[3], followingId: userIds[0] },
    { followerId: userIds[3], followingId: userIds[4] },
    { followerId: userIds[4], followingId: userIds[0] },
    { followerId: userIds[4], followingId: userIds[1] },
    { followerId: userIds[4], followingId: userIds[2] }
  ];

  // Seed some likes
  const likes = [
    { userId: userIds[1], postId: posts[0].id },
    { userId: userIds[2], postId: posts[0].id },
    { userId: userIds[3], postId: posts[0].id },
    { userId: userIds[0], postId: posts[1].id },
    { userId: userIds[2], postId: posts[1].id },
    { userId: userIds[0], postId: posts[2].id },
    { userId: userIds[1], postId: posts[2].id },
    { userId: userIds[4], postId: posts[2].id },
    { userId: userIds[0], postId: posts[4].id },
    { userId: userIds[1], postId: posts[4].id },
    { userId: userIds[0], postId: posts[6].id },
    { userId: userIds[2], postId: posts[9].id },
    { userId: userIds[3], postId: posts[9].id },
    { userId: userIds[0], postId: posts[13].id },
    { userId: userIds[1], postId: posts[13].id },
    { userId: userIds[4], postId: posts[13].id },
    { userId: userIds[2], postId: posts[15].id },
    { userId: userIds[3], postId: posts[16].id },
    { userId: userIds[0], postId: posts[19].id }
  ];

  // Seed some comments
  const comments = [
    { id: uuidv4(), postId: posts[0].id, authorId: userIds[1], text: 'Congrats! Vercel really is smooth.', createdAt: new Date(now.getTime() - 58 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), postId: posts[0].id, authorId: userIds[2], text: 'Which framework did you use?', createdAt: new Date(now.getTime() - 57 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), postId: posts[2].id, authorId: userIds[0], text: 'Stunning photo! Where was this?', createdAt: new Date(now.getTime() - 50 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), postId: posts[4].id, authorId: userIds[3], text: 'Totally agree. Reliability is king.', createdAt: new Date(now.getTime() - 44 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), postId: posts[9].id, authorId: userIds[0], text: 'Which meetup was this? I want to go next time!', createdAt: new Date(now.getTime() - 28 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), postId: posts[13].id, authorId: userIds[0], text: '500 stars is huge! Well deserved.', createdAt: new Date(now.getTime() - 16 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), postId: posts[13].id, authorId: userIds[4], text: 'What does the CLI do?', createdAt: new Date(now.getTime() - 15 * 60 * 60 * 1000).toISOString() }
  ];

  // Seed some notifications
  const notifications = [
    { id: uuidv4(), userId: userIds[0], type: 'like', actorId: userIds[1], postId: posts[0].id, read: false, createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), userId: userIds[0], type: 'comment', actorId: userIds[2], postId: posts[0].id, read: false, createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() },
    { id: uuidv4(), userId: userIds[0], type: 'follow', actorId: userIds[3], postId: null, read: true, createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString() }
  ];

  return { users, posts, follows, likes, comments, notifications, defaultUserId: userIds[0] };
}

module.exports = { generateSeedData };
