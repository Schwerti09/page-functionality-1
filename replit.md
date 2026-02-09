# ZipShip - Cloud Deployment Platform

## Overview
ZipShip is a futuristic cloud deployment platform that allows users to deploy projects via drag & drop. Users upload a ZIP file and ZipShip creates a GitHub repository from the contents. The platform features a premium "Orbital Command Center" themed landing page with bilingual support (EN/DE), user authentication via Replit Auth, and a pay-per-deploy pricing model with Stripe integration.

## Core Feature: ZIP to GitHub
1. User uploads a ZIP file via drag & drop
2. Backend extracts the ZIP contents
3. Creates a new GitHub repository in the user's connected GitHub account
4. Pushes all files to the repository
5. Returns the live GitHub URL

## Current State
- Landing page: "Orbital Command Center" design with animated terminal, stats, testimonials
- Authentication: Replit Auth integration complete
- Dashboard: Complete with deploy stats, ZIP upload, and purchase options
- **GitHub Integration**: Fully functional - uploads ZIP, creates repo, pushes files
- Payments: Stripe integration active with dynamic pricing
- Database: PostgreSQL with users, sessions, purchases, and deploys tables
- Legal pages: Impressum, Datenschutz, AGB complete

## Company Information
- **Name**: ZIP-SHIP
- **Owner**: Rolf Schwertfechter
- **Address**: Karklandsweg 1, 26553 Dornum
- **Email**: support@zip-ship.com
- **Domain**: https://zip-ship-revolution.com
- **Tax**: Steuerangaben auf Anfrage

## Project Architecture

### Frontend (client/)
- **Framework**: React with Vite
- **Routing**: wouter
- **Styling**: Tailwind CSS with Cyberpunk Neon-Glow Theme
  - Space Blue: #0A0E27 (primary background)
  - Neon Cyan: #00F0FF (primary accents with glow effects)
  - Success Green: #00C853 (success states, gradients)
  - Warn Orange: #FF9100 (AI features, warnings)
  - Gold: #FFD700 (premium CTAs, best value badges)
- **State Management**: TanStack Query for server state
- **Components**: Shadcn UI components with custom neon styling

### Backend (server/)
- **Framework**: Express.js
- **Database**: PostgreSQL via Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **Payments**: Stripe (dynamic pricing, no pre-created products)

### Key Files
- `client/src/pages/home.tsx` - Landing page with premium design
- `client/src/pages/dashboard.tsx` - User dashboard with ZIP upload
- `client/src/pages/faq.tsx` - FAQ page with 6 categories, bilingual, FAQPage schema
- `client/src/pages/team.tsx` - About/Team page with founder profile, Organization schema
- `client/src/pages/docs.tsx` - Technical documentation with API reference
- `client/src/pages/blog.tsx` - Blog section with bilingual content
- `client/src/pages/legal.tsx` - Impressum, Datenschutz, AGB
- `server/routes.ts` - API endpoints including /api/deploy-zip
- `server/storage.ts` - Database operations
- `server/github.ts` - GitHub API integration (Replit connector)
- `shared/schema.ts` - Database models and types

## Pricing Structure (SaaS Subscriptions)
- **Starter**: 0€/Monat (1 Projekt, Basic GitHub Integration) - Kostenlos
- **Pro**: 19€/Monat (5 Projekte, Unlimited Deploys, KI-Auto-Fix, 7-Tage-Trial) - Beliebteste
- **Agency**: 49€/Monat (Unlimited Projekte, Team Features, Priority Support)

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection (auto-configured)
- `SESSION_SECRET` - Session encryption key (auto-configured)
- `STRIPE_SECRET_KEY` - Stripe API key for payments (user-provided)
- `STRIPE_WEBHOOK_SECRET` - (Optional) For production webhook verification

## API Endpoints
- `GET /api/auth/user` - Get current user
- `GET /api/user/stats` - Get user's deploy stats and purchases
- `GET /api/deploys` - List user's deployments
- `POST /api/deploys` - Create new deployment (legacy)
- `POST /api/deploy-zip` - **NEW** Upload ZIP and create GitHub repo
- `GET /api/github/status` - Check GitHub connection status
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhook/stripe` - Stripe webhook handler
- `GET /api/plans` - Get pricing plans
- `POST /api/test/grant-credits` - Grant free test credits

## Recent Changes (Feb 5, 2026)
- **Viral Loop: "Powered by Zip-Ship" Badge** - Free Tier users get a subtle badge injected into their HTML files
  - Sticky footer badge with UTM tracking (utm_source=user_site)
  - Only for Starter plan users, removed for Pro/Agency tiers
  - Neon-glow styled badge matching brand aesthetics
- **Programmatic SEO: Framework Landing Pages** - Dynamic /deploy/:framework routes
  - Supported: react, nextjs, vue, angular, svelte, html, python, nodejs
  - Each page has framework-specific features, icons, and bilingual content
  - JSON-LD SoftwareApplication structured data per page
  - Full sitemap integration with all 8 framework URLs
- **Enhanced Homepage SEO** - Comprehensive structured data
  - JSON-LD SoftwareApplication schema with pricing offers
  - Complete Open Graph and Twitter Card meta tags
  - Canonical URL and proper meta descriptions
- `client/src/pages/deploy-framework.tsx` - NEW: Dynamic framework landing pages

## Previous Changes (Feb 4, 2026)
- **Complete Design System Overhaul** - New Cyberpunk Neon-Glow aesthetic
  - Updated color palette: Space-Blue #0A0E27, Neon-Cyan #00F0FF, Success-Green #00C853, Warn-Orange #FF9100
  - Extensive neon glow effects on all interactive elements
  - Consistent shadow effects with smooth transitions
- **SEO Optimization Complete**
  - Updated domain to https://zip-ship-revolution.com
  - Enhanced meta tags, Open Graph, Twitter Cards
  - Improved JSON-LD structured data with FAQ and feature lists
  - Updated sitemap.xml and robots.txt
- **Blog Section Enhanced** - Bilingual content marketing with neon styling
- **Dashboard Redesign** - Complete overhaul with new neon glow effects
- **Legal Pages Updated** - Impressum, Datenschutz, AGB with new design

## Previous Changes (Feb 2, 2026)
- **BREAKING: Eigene Email/Passwort Authentifizierung** - Ersetzt Replit Auth
  - Neues Login/Register Modal auf der Landingpage
  - Email/Passwort Registrierung und Login
  - Passwort-Hashing mit bcrypt
  - Session-basierte Authentifizierung
- **Admin-Only Test Credits** - Nur der Admin (schwertfechterrolle@web.de) kann Test-Credits vergeben
- **Performance-Optimierungen**:
  - Zipper-Animation entfernt (3s Ladezeit gespart)
  - Critical CSS inline im HTML für sofortiges Rendering
  - JetBrains Mono durch System-Fonts ersetzt (30KB gespart)
  - Google Fonts non-blocking deferred loading
  - Pulse-glow Animation durch leichtere hover-Animation ersetzt
- **Fette Story Sektion** - "THE FASTEST WAY TO GITHUB" mit großen Zahlen (5 SEC, 0 CMD, 100% AUTO)
- **NEW: KI-Auto-Fix** - Automatische Projekt-Fehlerbehebung mit Replit AI Integration
  - Behebt Version-Mismatches (z.B. @next/swc vs next Version)
  - Korrigiert korrupte oder fehlende favicon.ico
  - Repariert fehlerhafte Configs (next.config.js, tsconfig.json)
  - Toggle im Dashboard zum Aktivieren/Deaktivieren
- **MAJOR: GitHub Integration** - ZIP files now create real GitHub repos
- Added server/github.ts for GitHub API via Replit connector
- Added server/ai-fixer.ts for AI-powered project analysis and fixes
- Dashboard shows GitHub repo links after successful deploy
- Added test credits button for free testing (5 credits at a time)
- Added "How It Works" section explaining the 3-step deployment process
- Added ZIP file drag-and-drop upload to dashboard
- Created professional SVG logo and favicon
- Updated legal pages with correct email (support@zip-ship.com)
- Added Google Search Console verification file
- Comprehensive SEO: meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- Semantic HTML5 structure with proper accessibility (aria-labels, landmarks)
- robots.txt and sitemap.xml for search engine indexing

## Previous Changes (Feb 1, 2026)
- Redesigned landing page with "Orbital Command Center" theme
- Added animated terminal showing deployment process
- Added problem/solution comparison section
- Added social proof with stats and testimonials
- Updated pricing cards with gold-highlighted Pro Pack
- Added sticky email capture footer
- Created legal pages (Impressum, Datenschutz, AGB)

## User Preferences
- Dark mode with futuristic design
- Bilingual support (English/German)
- No subscriptions - pay-per-deploy model
