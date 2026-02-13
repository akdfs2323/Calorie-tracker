# 📁 CalorieMate - Project Structure

```
calorie-tracker/
│
├── 📄 Configuration Files
│   ├── package.json              # NPM dependencies
│   ├── next.config.js            # Next.js configuration
│   ├── tailwind.config.js        # Tailwind CSS theme & colors
│   ├── tsconfig.json             # TypeScript configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── .env.local                # Environment variables (DO NOT COMMIT)
│   ├── .gitignore                # Git ignore rules
│   ├── README.md                 # Project documentation
│   ├── SETUP_GUIDE.md            # Detailed setup instructions
│   └── supabase-schema.sql       # Database schema SQL
│
├── 📱 app/                       # Next.js App Router
│   │
│   ├── 🎨 UI Pages
│   │   ├── layout.tsx            # Root layout (fonts, global styles)
│   │   ├── page.tsx              # Landing page (/)
│   │   ├── globals.css           # Global CSS with custom utilities
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx          # Login page (/login)
│   │   │
│   │   └── signup/
│   │       └── page.tsx          # Signup page (/signup)
│   │
│   ├── 🏠 dashboard/             # Protected dashboard pages
│   │   ├── page.tsx              # Main dashboard (/dashboard)
│   │   │
│   │   ├── camera/
│   │   │   └── page.tsx          # Food scanning (/dashboard/camera)
│   │   │
│   │   ├── chat/
│   │   │   └── page.tsx          # AI chat (/dashboard/chat)
│   │   │
│   │   └── profile/
│   │       └── page.tsx          # User profile (/dashboard/profile)
│   │
│   └── 🔌 api/                   # API Routes (Backend)
│       │
│       ├── analyze-food/
│       │   └── route.ts          # POST /api/analyze-food
│       │                         # → Analyzes food image with Gemini AI
│       │
│       └── chat/
│           └── route.ts          # POST /api/chat
│                                 # → Chat with Gemini AI
│
├── 🧩 components/                # Reusable React Components
│   └── Navbar.tsx                # Navigation bar component
│
├── 🛠️ lib/                       # Utility Libraries
│   ├── supabase.ts               # Supabase client & helper functions
│   │                             # → Auth, Database CRUD operations
│   │
│   └── gemini.ts                 # Google Gemini AI integration
│                                 # → Food analysis & chat functions
│
└── 📝 types/                     # TypeScript Type Definitions
    └── index.ts                  # All type definitions
                                  # → User, Profile, CalorieEntry, etc.
```

## 🗄️ Database Schema (Supabase)

```
┌─────────────────────────────────────────────────────────────┐
│                        Database Tables                       │
└─────────────────────────────────────────────────────────────┘

1. 👤 profiles
   ├── id (UUID, Primary Key)
   ├── user_id (UUID, Foreign Key → auth.users)
   ├── current_weight (DECIMAL)
   ├── target_weight (DECIMAL)
   ├── height (DECIMAL)
   ├── age (INTEGER)
   ├── gender (TEXT)
   ├── activity_level (TEXT)
   ├── created_at (TIMESTAMP)
   └── updated_at (TIMESTAMP)

2. 🍽️ calorie_entries
   ├── id (UUID, Primary Key)
   ├── user_id (UUID, Foreign Key → auth.users)
   ├── food_name (TEXT)
   ├── calories (INTEGER)
   ├── protein (DECIMAL)
   ├── carbs (DECIMAL)
   ├── fat (DECIMAL)
   ├── image_url (TEXT)
   ├── meal_type (TEXT: breakfast|lunch|dinner|snack)
   ├── entry_date (DATE)
   └── created_at (TIMESTAMP)

3. 💬 chat_messages
   ├── id (UUID, Primary Key)
   ├── user_id (UUID, Foreign Key → auth.users)
   ├── role (TEXT: user|assistant)
   ├── content (TEXT)
   └── created_at (TIMESTAMP)
```

## 🔄 Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     User Journey Flow                         │
└──────────────────────────────────────────────────────────────┘

1. Authentication Flow:
   User → Signup/Login → Supabase Auth → Dashboard

2. Food Analysis Flow:
   User uploads image → /api/analyze-food → Gemini AI → 
   Returns nutrition data → Save to calorie_entries → Update UI

3. Chat Flow:
   User sends message → /api/chat → Gemini AI →
   Returns response → Save to chat_messages → Display in UI

4. Profile Flow:
   User updates profile → Save to profiles table → 
   Calculate BMI & recommendations → Update UI
```

## 🎯 Key Features by File

### Landing Page (`app/page.tsx`)
- ✨ Hero section with animations
- 📋 Feature showcase
- 🎨 Glassmorphism effects
- 🔗 Call-to-action buttons

### Dashboard (`app/dashboard/page.tsx`)
- 📊 Daily calorie summary
- 🎯 Progress tracking
- 📈 Nutrition breakdown
- 🍽️ Meal history

### Camera (`app/dashboard/camera/page.tsx`)
- 📸 Image upload/capture
- 🤖 AI food analysis
- 🍴 Meal type selection
- 💾 Save to database

### Chat (`app/dashboard/chat/page.tsx`)
- 💬 Real-time chat interface
- 🤖 AI nutrition advisor
- 📝 Chat history
- 💡 Suggested questions

### Profile (`app/dashboard/profile/page.tsx`)
- ⚖️ Weight tracking
- 🎯 Goal setting
- 📏 BMI calculation
- ⚙️ User preferences

## 🔐 Security Features

```
┌──────────────────────────────────────────────────────────────┐
│                    Security Layers                            │
└──────────────────────────────────────────────────────────────┘

1. Row Level Security (RLS)
   └── Users can only access their own data

2. Authentication
   └── Supabase Auth with email/password

3. Environment Variables
   └── Sensitive keys stored securely

4. API Protection
   └── Server-side validation

5. HTTPS Only
   └── Encrypted connections in production
```

## 🎨 Styling System

```
┌──────────────────────────────────────────────────────────────┐
│                    Design System                              │
└──────────────────────────────────────────────────────────────┘

Colors:
├── Primary (Orange): #f97316
├── Accent (Purple): #d946ef
└── Background: Gradient mesh

Fonts:
├── Display: Poppins (Headings)
└── Body: DM Sans (Body text)

Effects:
├── Glassmorphism (.glass class)
├── Gradients (bg-gradient-to-r)
├── Animations (floating, pulse)
└── Shadows (shadow-xl)

Components:
├── .btn-primary (Primary buttons)
├── .btn-secondary (Secondary buttons)
├── .input-field (Form inputs)
└── .card (Content cards)
```

## 📦 Dependencies Overview

### Production Dependencies:
- `next`: React framework
- `react` & `react-dom`: UI library
- `@supabase/supabase-js`: Database client
- `@google/generative-ai`: Gemini AI SDK
- `framer-motion`: Animations
- `lucide-react`: Icon library
- `recharts`: Charts (if needed)

### Dev Dependencies:
- `typescript`: Type safety
- `tailwindcss`: CSS framework
- `autoprefixer` & `postcss`: CSS processing
- `@types/*`: TypeScript types

## 🚀 Deployment Checklist

- [ ] Setup Supabase project
- [ ] Run database schema
- [ ] Get Gemini API key
- [ ] Configure environment variables
- [ ] Test all features locally
- [ ] Build for production (`npm run build`)
- [ ] Deploy to Vercel/Netlify
- [ ] Set production environment variables
- [ ] Test production deployment
- [ ] Monitor error logs

---

**Note**: This structure follows Next.js 14 App Router conventions with TypeScript and Tailwind CSS.
