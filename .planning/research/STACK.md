# Stack Research: Social Media Feed

## Recommended Stack

### Runtime & Framework
- **Node.js 20 LTS** — stable, Vercel-native
- **Express 4.x** — lightweight, well-documented, Vercel-compatible
- **Confidence:** HIGH

### Frontend
- **Server-rendered HTML + Vanilla JS** — no build step, single deployment unit
- **CSS Variables** for theming — modern, no preprocessor needed
- **Confidence:** HIGH

### Storage
- **In-memory JavaScript objects** — Map/Object-based stores
- No ORM, no database driver needed
- **Confidence:** HIGH (demo app requirement)

### Deployment
- **Vercel** — serverless Node.js functions
- `vercel.json` with `@vercel/node` builder
- Entry point: `api/index.js` importing Express app from `src/app.js`
- **Confidence:** HIGH

### Testing
- **Node.js built-in test runner** (`node:test`) — zero dependencies
- `node:assert` for assertions
- **Confidence:** HIGH

### Key Libraries
| Library | Version | Purpose | Rationale |
|---------|---------|---------|-----------|
| express | ^4.21 | HTTP framework | Industry standard, Vercel-compatible |
| uuid | ^11 | Generate unique IDs | Lightweight, no crypto dependency issues |

### What NOT to Use
- **React/Vue/Angular** — overkill for this scope, adds build complexity
- **Database (Postgres, MongoDB)** — in-memory requirement
- **TypeScript** — adds build step, unnecessary for demo
- **Webpack/Vite** — no build step needed with server-rendered HTML
- **Jest/Vitest** — Node.js built-in test runner is sufficient

---
*Researched: 2026-03-10*
