# Solo Leveling System - Life Transformation Platform

A comprehensive personal development and schedule management platform inspired by Solo Leveling, featuring military-grade discipline tracking, AI-powered insights, and gamified progress monitoring.

## 🚀 Features

### Core Systems
- **Daily Schedule Management** - Hour-by-hour tracking with 14+ customizable time blocks
- **Solo Leveling XP System** - Earn XP across 7 stats: Intelligence Operative, Combat Mastery, Business Warrior, Athletic Dominance, Mental Fortress, Academic Excellence, Physical Weapon
- **AI Insights & Adaptations** - Pattern detection, schedule optimization, predictive analytics
- **Discipline Code Tracker** - 20 rules with violation tracking and consequences
- **Combat Skills Training** - Track HEMA, Striking, Grappling, and MMA training
- **Daily Affirmations** - Category-based affirmations integrated into schedule blocks
- **Achievement System** - Unlockable badges and progress milestones
- **Military Command Center** - Dark, serious interface with accountability metrics

### UI/UX
- **Premium Sidebar Navigation** - 12 different views with collapsible design
- **Command Palette** (⌘K) - Spotlight-style quick actions
- **Dark Mode** - Professional slate theme
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Smooth Animations** - Powered by Framer Motion
- **Data Visualization** - Interactive charts with Recharts

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
- **Git** - For version control

## 🛠️ Installation

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd Tasks1
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Go to **Settings** → **API** to get your credentials
3. Copy `.env.example` to `.env.local`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Edit `.env.local` and add your Supabase credentials:

\`\`\`env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

### 4. Run Database Migrations

In your Supabase project dashboard:

1. Go to **SQL Editor**
2. Run each migration file from `supabase/migrations/` in order:
   - `20251021043748_create_schedule_management_tables.sql`
   - `20251021044440_add_discipline_code_system.sql`
   - `20251027213321_add_ai_analytics_and_achievements_tables.sql`
   - `20251114212827_add_daily_schedule_blocks_table.sql`

### 5. Seed the Database (Optional)

To populate your database with initial data:

\`\`\`bash
# Add your Service Role Key to .env.local (NEVER commit this!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Run the seed script
npm run seed
\`\`\`

### 6. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:5173` in your browser.

## 🔐 Authentication

The app uses Supabase Authentication:

1. **Sign Up**: Create a new account with email/password
2. **Sign In**: Log in with your credentials
3. **Row Level Security**: All user data is isolated by user ID

### First User Setup

1. Go to `http://localhost:5173`
2. Click "Sign up"
3. Enter your email and password
4. Check your email for verification (in development, check Supabase → Authentication → Users)
5. Your data will be automatically created when you start using the app

## 📂 Project Structure

\`\`\`
Tasks1/
├── src/
│   ├── components/          # React components (28 files)
│   │   ├── Login.tsx       # Authentication UI
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── DailyScheduleView.tsx  # Daily schedule with XP
│   │   ├── SoloLevelingCombat.tsx # Combat training tracker
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/
│   │   └── useScheduleData.ts  # Data fetching hook
│   ├── lib/
│   │   └── supabase.ts     # Supabase client
│   ├── data/              # Seed data and mock data
│   ├── types/             # TypeScript types
│   └── App.tsx            # Main app component
├── supabase/
│   ├── migrations/        # Database schema
│   └── config.toml        # Local Supabase config
├── scripts/
│   └── seed.ts           # Database seeding script
└── package.json
\`\`\`

## 🗄️ Database Tables

### Core Tables
- `schedule_templates` - Different schedule types
- `time_blocks` - Individual scheduled activities
- `task_instructions` - Step-by-step instructions
- `resources` - Video links and tutorials
- `user_progress` - Daily completion tracking
- `daily_schedule_blocks` - Editable daily schedules with XP

### Discipline System
- `discipline_rules` - 20 discipline rules
- `consequences` - Tiered penalties
- `rule_violations` - Violation history
- `daily_rule_reviews` - Daily adherence checks
- `discipline_streaks` - Streak tracking

### AI & Analytics
- `ai_adaptations` - AI-suggested changes
- `pattern_detections` - Behavioral insights
- `achievements` - User achievements
- `notifications` - System notifications
- `daily_analytics` - Performance metrics

## 🧪 Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
npm run seed         # Seed database with initial data
npm run test         # Run tests (when configured)
\`\`\`

## 🎨 Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
\`\`\`bash
npm i -g vercel
\`\`\`

2. Deploy:
\`\`\`bash
vercel
\`\`\`

3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Update Supabase Auth settings:
   - Go to **Authentication** → **URL Configuration**
   - Add your Vercel URL to **Site URL** and **Redirect URLs**

### Deploy to Netlify

See `netlify.toml` for configuration.

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **Authentication required** for all operations
- **Environment variables** for sensitive credentials
- **.gitignore** configured to exclude secrets
- **Service Role Key** only for backend operations (never in frontend)

## 📊 Key Components

### Dashboard
- Live clock with current time
- AI status panel with pending adaptations
- Quick stats: tasks completed, completion rate, streak, rules followed
- Today at a glance: current and upcoming activities
- Performance overview with circular progress

### Daily Schedule View
- Editable schedule blocks with XP tracking
- Integrated affirmations and combat training
- Real-time progress updates
- Template-based or custom schedules

### AI Insights
- Adaptation history with success metrics
- Pattern recognition with confidence scores
- Optimization breakdown across 5 categories
- Tomorrow's forecast with risk assessment

### Discipline Tracker
- 20 military-grade rules
- Violation tracking with consequences
- Weekly compliance trends
- At-risk rules highlighting

## 🎯 Usage Tips

1. **Start Your Day**: Check Daily Schedule view for today's blocks
2. **Track Progress**: Mark activities complete as you finish them
3. **Review AI Insights**: Check weekly for optimization suggestions
4. **Monitor Discipline**: Daily rule review to maintain accountability
5. **Earn Achievements**: Complete challenges to unlock badges
6. **Review Analytics**: Weekly performance analysis

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome!

## 📝 License

MIT

## 🙏 Acknowledgments

- Inspired by **Solo Leveling** manhwa/anime
- Built with ❤️ for personal development and discipline

---

**Daily XP Potential**: ~385 XP/day (~2,695 XP/week)
**Current Version**: 1.0.0
**Status**: Production Ready ✅

For issues or questions, please create an issue on GitHub.
