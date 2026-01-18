# Arcana Echo - Complete Tech Stack

## Frontend
**Framework:** Next.js 14+ (App Router)
- Server-side rendering for SEO (important for discoverability)
- Built-in API routes for secure backend logic
- You already know this from Curve Labs work

**UI/Styling:**
- **Tailwind CSS** - Mobile-first responsive design
- **shadcn/ui** - Pre-built accessible components
- **Framer Motion** - Card animations, shuffle effects, reveal animations
- **React Hook Form** - Question refinement forms, user settings

**PWA (Progressive Web App):**
- **next-pwa** - Makes it installable on mobile home screens
- Service workers for offline card meanings
- Push notifications for daily card reminders (optional monetization feature)

## Backend & API

**API Layer:** Next.js API Routes
- `/api/reading` - Generate readings with Gemini
- `/api/cards` - Card data and interpretations
- `/api/user` - User profile, preferences
- `/api/journal` - Save readings and reflections
- `/api/payment` - Stripe webhooks

**AI Integration:**
- **Google Gemini API** (you already have experience with AI Studio)
- Structured prompts for:
  - Question refinement
  - Context-aware interpretations
  - Reflection prompt generation
  - Learning insights from past readings

## Database

**Primary Database:** Supabase (PostgreSQL)
- **Why:** Free tier, built-in auth, real-time subscriptions, easy to scale
- **Alternative:** Firebase (if you prefer Google ecosystem)

**Schema Structure:**
```
Users
- id, email, created_at, subscription_tier, daily_readings_count

Readings
- id, user_id, question, refined_question, cards_drawn, spread_type, context_area, timestamp

Card_Interactions
- user_id, card_id, times_drawn, user_notes, resonance_level

Interpretations (static/cached)
- card_id, position, context_area, symbolism, keywords, reflection_prompts

Journal_Entries
- reading_id, user_reflection, insights, timestamp
```

## Authentication

**Auth Provider:** Supabase Auth or Clerk
- Email/password
- Google OAuth (easier onboarding)
- Magic links
- Session management

## Payments & Monetization

**Payment Processor:** Stripe
- **Stripe Checkout** - Subscription management
- **Stripe Customer Portal** - Users manage their own billing
- **Webhook handling** - Upgrade/downgrade tier management

**Pricing Tiers:**
```
Free: 2 readings/day, single-card draws only
Basic ($4.99/mo): Unlimited readings, all spreads
Premium ($9.99/mo): + AI question refinement, learning insights, export readings
```

## Card Deck & Assets

**Card Images:**
- Midjourney-generated deck (78 cards: 22 Major + 56 Minor Arcana)
- Format: High-res PNG or WebP for web performance
- Storage: Cloudinary or Supabase Storage

**Interpretation Content:**
- **Public domain sources to process:**
  - A.E. Waite's "Pictorial Key to the Tarot" (1911)
  - P.D. Ouspensky's "Symbolism of the Tarot" (1913)
  - S.L. MacGregor Mathers' interpretations

**Content Management:**
- JSON files or database for card interpretations
- Structured format:
```json
{
  "card_id": "fool",
  "core_symbolism": "...",
  "keywords": ["beginnings", "innocence", "leap of faith"],
  "contexts": {
    "love": "...",
    "career": "...",
    "spiritual": "...",
    "shadow": "..."
  },
  "reflection_prompts": ["What new beginning calls to you?", ...],
  "position_meanings": {
    "past": "...",
    "present": "...",
    "future": "..."
  }
}
```

## Features Implementation

**Question Refinement System:**
- Pre-reading modal with examples
- AI-powered suggestion engine (Gemini)
- Question quality score
- Template library for common queries

**Reading Types/Spreads:**
- Single card (free tier)
- Three-card (Past/Present/Future)
- Celtic Cross
- Relationship spread
- Career guidance spread
- Custom positions

**Learning Journey Tracking:**
- Card frequency dashboard
- Personal card resonance ratings
- Pattern recognition (which cards appear together)
- Progress milestones
- "Card of the Week" deep dive

**Journal System:**
- Post-reading reflection prompts
- Rich text editor (TipTap or similar)
- Tag readings by topic
- Search past readings
- Export as PDF

## Deployment & Hosting

**Platform:** Vercel
- Automatic deployments from GitHub
- Edge functions for API routes
- Built-in analytics
- Free SSL

**Domain:** 
- Custom domain (arcanaecho.com or similar)
- Vercel handles DNS

**Environment Variables:**
- Gemini API key
- Supabase credentials
- Stripe keys
- OAuth secrets

## Analytics & Monitoring

**Analytics:** Vercel Analytics + Plausible
- Privacy-focused (important for spiritual app)
- Track: readings per day, popular spreads, conversion rates

**Error Tracking:** Sentry
- Catch API failures
- Monitor Gemini API rate limits

**Performance:** Vercel Speed Insights
- Core Web Vitals monitoring

## Development Tools

**Version Control:** GitHub
- Main branch → Production (Vercel)
- Dev branch → Staging environment

**Code Quality:**
- TypeScript (type safety)
- ESLint + Prettier
- Husky pre-commit hooks

**Testing:**
- Vitest (unit tests for interpretation logic)
- Playwright (E2E for critical flows: signup, reading, payment)

## Future Enhancements (Phase 2)

**Native Mobile App:**
- React Native (reuse logic)
- Or: Capacitor (wrap PWA)

**Advanced Features:**
- Voice input for questions
- Community features (share readings anonymously)
- Daily card push notifications
- Integration with journal apps
- Astrology integration (your specialty!)

**AI Enhancements:**
- Fine-tuned model on your interpretation style
- Personalized readings based on user's past cards
- Pattern recognition in card sequences

## Cost Estimate (Monthly)

**Starting costs:**
- Vercel: $0 (hobby tier, upgrade at ~10k users)
- Supabase: $0 (free tier, 500MB database)
- Gemini API: ~$20-50 (depends on usage, very cheap)
- Stripe: $0 base + 2.9% + 30¢ per transaction
- Domain: ~$12/year
- Cloudinary (images): $0 (free tier)

**Total to start:** ~$2-5/month until you have paying users

---

## Immediate Next Steps

1. Set up Next.js project with TypeScript
2. Create Supabase account and database schema
3. Build card data structure from public domain sources
4. Design mobile-first card UI
5. Integrate Gemini API for interpretations
6. Add Stripe for payments
