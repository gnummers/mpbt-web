import { NextResponse } from 'next/server';

// This route handler takes priority over the /api/* rewrite in next.config.ts,
// so it is served directly by Next.js rather than proxied to the NestJS API.
//
// Both the Tauri launcher and the Godot client fetch this endpoint on startup
// to discover addresses without anything being baked into the compiled binary.

export const dynamic = 'force-dynamic';

const CORS = { 'Access-Control-Allow-Origin': '*' };

export function GET() {
  // PUBLIC_API_URL is what desktop clients use — must be a publicly reachable
  // address.  API_URL is the internal Docker network URL used by Next.js
  // server-side rewrites and should never be sent to clients.
  const publicApiUrl = (
    process.env.PUBLIC_API_URL ??
    process.env.API_URL ??
    'http://localhost:3001'
  ).replace(/\/+$/, '');

  const gameApiUrl = (
    process.env.GAME_API_URL ??
    'http://localhost:3002'
  ).replace(/\/+$/, '');

  return NextResponse.json({
    version: process.env.npm_package_version ?? '0.1.0',
    apiUrl: publicApiUrl,
    gameApiUrl,
    gameServer: process.env.GAME_SERVER ?? '127.0.0.1:2000',
  }, { headers: CORS });
}
