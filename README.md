# CreatorStart

A content planning platform for beginner YouTube and Instagram creators.

## Current Progress

- ✅ Project setup — React + Vite + Tailwind CSS
- ✅ Supabase integration — Auth + Database
- ✅ Email/Password authentication
- ✅ Platform selection — YouTube / Instagram / Both
- ✅ Dynamic theme switching based on platform
- ✅ Sidebar with hover expand/collapse
- ✅ Protected routes

## Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database & Auth:** Supabase (PostgreSQL + Auth)  
**AI (planned):** Gemini API

## Project Structure
```
CreatorStart/
├── frontend/
│   ├── src/
│   │   ├── components/   # Sidebar
│   │   ├── context/      # PlatformContext
│   │   ├── pages/        # Auth, Dashboard, Planner, etc.
│   │   ├── supabase.js
│   │   └── App.jsx
│   └── .env
├── backend/
└── README.md
```

## Database Schema

**profiles** — id, name, platform, niche  
**posts** — id, user_id, title, platform, day, status  
**planner** — id, user_id, day, content, platform

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm run dev
```

## Team

- Varun Yadav
- Om Manoj Hire