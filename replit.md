# Overview

SubCircle is a mobile-first web application for managing and sharing streaming service subscriptions. It provides a secure platform where users can track their subscriptions, share credentials with trusted partners, and receive notifications about renewals and partner connections. The app features local-only credential storage with client-side encryption for maximum security.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system variables for consistent theming
- **State Management**: React Query (TanStack Query) for server state management with built-in caching
- **Routing**: React Router for client-side navigation with mobile-first page structure
- **Mobile Support**: Capacitor integration for native mobile app deployment

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database**: Drizzle ORM with Neon Database (PostgreSQL-compatible serverless database)
- **Authentication**: Replit Auth (OpenID Connect) for user management with Google OAuth support
- **API Structure**: RESTful API endpoints for notifications and push notification management

## Data Storage
- **Primary Database**: PostgreSQL via Neon Database for user profiles, subscriptions, partner connections, and notifications
- **Local Storage**: Browser localStorage for credential encryption keys and user preferences
- **Credential Security**: Client-side AES-GCM encryption using Web Crypto API with user-specific PBKDF2 key derivation

## Authentication & Authorization
- **Authentication Provider**: Replit Auth (OpenID Connect) with Google, GitHub, X, Apple, and email/password support
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Security Model**: Passport.js authentication middleware with token refresh
- **Credential Protection**: Master password system for local credential encryption/decryption

# External Dependencies

## Core Services
- **Replit Auth**: OpenID Connect authentication provider with OAuth support
- **Neon Database**: Serverless PostgreSQL database for production data storage
- **Web Push Protocol**: Native browser push notifications with VAPID keys

## Development & Build Tools
- **Replit Platform**: Primary development and deployment platform
- **Capacitor**: Cross-platform mobile app development framework
- **Vite**: Modern build tool and development server

## UI & Styling Libraries
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography

## External APIs & Services
- **SeekLogo CDN**: Primary service logo provider for reliable logo delivery
- **Icon.horse**: Fallback service logo resolution from domain names when SeekLogo unavailable
- **Service Worker**: Browser API for background push notification handling

# Deployment Configuration

## Production Deployment (Autoscale)
- **Deployment Type**: Autoscale (automatic scaling based on traffic)
- **Build Command**: `npm run build` (compiles React frontend with Vite)
- **Run Command**: `npm start` (starts Express server with tsx)
- **Server Port**: Automatically configured by Replit platform
- **Environment**: Production environment variables (DATABASE_URL, VAPID keys) synced automatically

## How to Deploy
1. Click the "Publish" button in Replit workspace header
2. Select "Autoscale" deployment type
3. Click "Set up your published app"
4. Your app will be live at `<app-name>.replit.app` within minutes
5. Optionally add a custom domain in deployment settings

# Recent Changes (October 2025)

## Fixed Static Asset Serving Bug (October 19, 2025)
- **Critical Bug Fixed**: Catch-all SPA route was intercepting `/assets/*.js` and `/assets/*.css` requests
- **Root Cause**: Express middleware ordering - catch-all was responding before static files could be served
- **Solution**: Modified catch-all to only handle GET requests and rely on express.static middleware priority
- **Result**: JavaScript and CSS files now serve correctly (HTTP 200 with proper content type)
- **Deployment Status**: Successfully deployed and verified working at https://subcircle.replit.app

## Successful Autoscale Deployment (October 19, 2025)
- **Deployment Status**: Successfully deployed to Replit Autoscale
- **Build Configuration**: Simplified to `npm run build` for frontend compilation
- **Run Configuration**: `npm start` with Express server on PORT environment variable
- **Port Configuration**: Server uses PORT env var (provided by Replit in production)
- **Database Connection**: Neon database auto-wakes on first connection (~500ms)
- **Known Issue**: Neon free tier auto-suspends after 5 minutes of inactivity - database wakes automatically when accessed

## Database Migration (October 19, 2025)
- **Migrated to Sydney Region**: Successfully moved from US East to Sydney (ap-southeast-2) Neon Database
- **New Endpoint**: `ep-wild-violet-a7wghesh-pooler.ap-southeast-2.aws.neon.tech`
- **Database Version**: PostgreSQL 17 on Neon serverless platform
- **Schema Status**: All tables created and synchronized (users, subscriptions, partners, notifications, push_subscriptions)
- **Performance**: Reduced latency for Asia-Pacific users with regional database placement

## Logo System Improvements
- **Migrated to SeekLogo CDN**: Replaced Wikipedia Commons URLs with reliable SeekLogo CDN for better logo availability
- **Fixed Missing Service Icons**: Corrected broken logos for Kayo Sports, Crunchyroll, and Shudder
- **Service Name Corrections**: Fixed "Shutter" → "Shudder" (horror streaming service)
- **Fallback System**: Maintains Icon.horse as backup with colored initial fallback for missing logos

## UI Improvements
- **Simplified Catalog Interface**: Removed category filter tabs (streaming/music) for cleaner user experience
- **Savings Display**: Added total monthly savings calculation showing money saved from partner-shared subscriptions
- **Responsive Design**: Maintained mobile-first approach with theme-adaptive styling

## Code Cleanup
- **Removed Test Components**: Deleted NotificationDemo and TestNotificationCreator from production build
- **Streamlined Notifications Page**: Reduced to two tabs (Notification Center and Settings)
- **File Organization**: Removed unused service-logos.ts file

## Demo Testing Features
- **Demo Partner Codes**: DEMO-YOU (user), DEMO-SAR, DEMO-ALE, DEMO-MIK (partners) for testing connections
- **Self-Connection Prevention**: System prevents users from connecting with themselves