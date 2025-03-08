# TRace

A real-time typing speed challenge built with Cloudflare Workers, Pages, and Durable Objects.

## Structure
- `client/`: Static UI for Cloudflare Pages.
- `server/`: Worker and Durable Object logic.

## Setup
1. Install dependencies: `npm install` in both `client/` and `server/`.
2. Deploy Client: `cd client && npm run deploy`.
3. Deploy Server: `cd server && npm run deploy`.

## Development
- Client: Serve locally with a static server (e.g., `npx serve public`).
- Server: Run `npm run dev` in `server/`.