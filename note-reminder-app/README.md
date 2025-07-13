# 📝 Note Reminder App

A modern note-taking and reminder web application built with Next.js 15 and Supabase.

## ✨ Features

### 📝 Notes & Reminders
- Create simple text notes
- Set optional reminder times for each note
- Support for recurring reminders (every X minutes/hours/days)
- Automatic alarm notifications when reminders are due
- Real-time countdown display

### 🎨 Visual Notification Customization
- Choose from multiple visual effects for each reminder:
  - 🌊 Shake (shaking water bottle effect)
  - ⏰ Blink (blinking alarm clock effect)
  - ⚡ Bounce (bouncing effect)
  - 💓 Pulse (pulsing effect)
- Visual animations trigger when alarms go off

### 🔐 Authentication
- OTP-based login using Supabase Auth
- Email magic link authentication
- Secure user sessions with Supabase client
- Row-level security for user data

### 🗄️ Database
- Supabase PostgreSQL database
- Row-level security for data protection
- Automatic timestamps and user isolation

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **UI Components**: Lucide React icons
- **Date Handling**: date-fns
- **TypeScript**: Full type safety

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account

### 1. Set up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the schema from `schema.sql`
3. Go to Project Settings → API to get your keys
4. Enable Email Auth in Authentication → Providers

### 2. Configure Environment Variables

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 3. Run the Application

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 🗄️ Database Schema

The application uses a single `notes` table:

```sql
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    reminder_time TIMESTAMP WITH TIME ZONE NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_interval INTEGER NULL,
    recurring_unit TEXT CHECK (recurring_unit IN ('minutes', 'hours', 'days')) NULL,
    visual_effect TEXT CHECK (visual_effect IN ('shake', 'blink', 'bounce', 'pulse')) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📱 Usage

1. **Sign In**: Enter your email to receive a magic link
2. **Create Notes**: Click "New Note" to create a note with optional reminders
3. **Set Reminders**: Choose a date/time and visual effect for notifications
4. **Recurring Reminders**: Enable recurring options for regular notifications
5. **Visual Effects**: Select from shake, blink, bounce, or pulse animations
6. **Manage Notes**: Edit or delete notes as needed

## 🔧 Development

### File Structure
```
src/
├── app/
│   ├── auth/callback/route.ts    # Auth callback handler
│   ├── layout.tsx                # Root layout with AuthProvider
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles + animations
├── components/
│   ├── Dashboard.tsx             # Main dashboard
│   ├── LoginForm.tsx             # Authentication form
│   ├── NoteCard.tsx              # Individual note display
│   └── NoteForm.tsx              # Create/edit note form
├── contexts/
│   └── AuthContext.tsx           # Authentication context
└── lib/
    └── supabase.ts               # Supabase client config
```

### Custom Animations
The app includes custom CSS animations defined in `globals.css`:
- `shake`: Shaking water bottle effect
- `blink`: Blinking alarm clock effect
- Plus built-in `bounce` and `pulse` animations

## 🔐 Security Features

- Row-level security (RLS) in Supabase
- User authentication with JWT tokens
- Secure environment variable handling
- XSS protection with proper sanitization

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js 15 and Supabase
