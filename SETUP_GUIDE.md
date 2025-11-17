# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials
# Get these from https://app.supabase.com/project/_/settings/api
```

Your `.env.local` should look like:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order (found in `supabase/migrations/`):
   - `20251021043748_create_schedule_management_tables.sql`
   - `20251021044440_add_discipline_code_system.sql`
   - `20251027213321_add_ai_analytics_and_achievements_tables.sql`
   - `20251114212827_add_daily_schedule_blocks_table.sql`

### Step 4: (Optional) Seed the Database

```bash
# Add Service Role Key to .env.local (get from Supabase Settings > API)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Run seed script
npm run seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` and create your account!

## 📱 What's Included

✅ **Authentication** - Secure login/signup with Supabase Auth
✅ **Database** - PostgreSQL with Row Level Security
✅ **Real-time Sync** - Live updates with Supabase subscriptions
✅ **Error Handling** - Error boundaries and graceful failures
✅ **Testing** - Vitest setup with example tests
✅ **PWA Support** - Installable as mobile/desktop app
✅ **Export/Import** - Backup and restore your data
✅ **Deployment Ready** - Vercel and Netlify configs included

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run seed         # Seed database with initial data
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

## 🚀 Deploy to Production

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Update Supabase Auth URLs:
- Go to Authentication → URL Configuration
- Add your Vercel URL to Site URL and Redirect URLs

### Netlify
```bash
npm run build
netlify deploy
```

Or connect your Git repository for automatic deployments.

## 📖 Features Overview

### Core Features
- **Daily Schedule Management** with XP tracking
- **Solo Leveling System** across 7 stat categories
- **AI Insights** with pattern detection
- **Discipline Tracker** with 20 military-grade rules
- **Combat Skills** training tracker
- **Daily Affirmations** system
- **Achievement System** with unlockable badges

### Technical Features
- **Authentication** with Supabase
- **Real-time Updates** when data changes
- **Export/Import** JSON backup/restore
- **PWA** installable on mobile/desktop
- **Error Boundaries** for graceful error handling
- **Testing** with Vitest and React Testing Library
- **Edge Functions** for backend logic (optional)

## 🆘 Troubleshooting

### Build Fails
- Make sure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run typecheck`
- Try clearing cache: `rm -rf node_modules dist && npm install`

### Can't Connect to Supabase
- Verify `.env.local` has correct credentials
- Check Supabase project is active (not paused)
- Ensure VITE_ prefix is present on environment variables

### Authentication Not Working
- Confirm auth is enabled in Supabase dashboard
- Check redirect URLs match your domain
- Verify RLS policies are set up correctly (run migrations)

### Need Help?
- Check the full README.md
- Review Supabase documentation
- Check browser console for errors

## 📚 Next Steps

1. **Customize Your Schedule** - Edit templates and time blocks
2. **Set Your Goals** - Configure XP values and achievements
3. **Track Progress** - Start completing daily tasks
4. **Review Analytics** - Check AI insights weekly
5. **Maintain Discipline** - Follow the 20 rules daily

---

Built with ❤️ for personal development and discipline.

Need more help? Check the full [README.md](./README.md)
