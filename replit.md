# Level Up Life - ارتقِ في حياتك

## Overview
A self-improvement RPG-style application that gamifies personal development. Users can track their progress in various life areas including physical strength, mental abilities, spiritual growth, and Quran memorization.

## Project Structure
- `client/` - Frontend React application
  - `src/pages/` - Page components (Index, Quests, Boss, Battle, etc.)
  - `src/components/` - Reusable UI components
  - `src/hooks/` - Custom React hooks including `useGameState` for game logic
  - `src/types/` - TypeScript type definitions
  - `src/lib/` - Utility functions
- `server/` - Express backend server
  - `index.ts` - Server entry point
  - `routes.ts` - API routes
  - `storage.ts` - Storage interface
  - `vite.ts` - Vite development server setup
- `shared/` - Shared types and schemas
  - `schema.ts` - Drizzle database schema

## Key Features
- Quest system with daily challenges across categories (strength, mind, spirit, quran)
- Boss battles with weekly challenges
- Player progression with levels and experience points
- Prayer quest tracking
- Shadow soldiers system
- Grand Quest (30-day challenges)
- Achievements system

## Technical Stack
- Frontend: React with TypeScript, TailwindCSS, Shadcn UI
- Backend: Express.js with TypeScript
- Database: PostgreSQL (Neon) with Drizzle ORM (prepared, currently uses localStorage)
- State Management: localStorage for game state persistence
- Build: Vite

## Running the Application
- Development: `npm run dev`
- Build: `npm run build`
- Start production: `npm run start`
- Database push: `npm run db:push`

## Recent Changes (December 2025)
- Migrated from Lovable to Replit environment
- Set up Express server with Vite middleware
- Configured for port 5000 with webview output
- Removed Supabase integration (app uses localStorage for game state)
- Added Drizzle ORM setup with basic user schema
