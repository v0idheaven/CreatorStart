# CreatorStart

**AI-powered content workspace for YouTube & Instagram creators.**

Plan 30 days of content, generate scripts and captions, track your posting streak, and analyze your channel performance — all in one place.

🌐 **Live:** [creatorstart.in](https://creatorstart.in)

---

## Features

### Content Generator
- Generate full scripts, key points, hooks + CTAs, outlines, or captions
- Platform-specific output for YouTube, Instagram, or both
- Custom niche, tone, goal, audience, and angle inputs
- Save creator profile for auto-fill on next visit
- Generation history (last 10 saved locally)

### 30-Day Planner
- AI builds a full month content calendar based on your goal and niche
- Content types: Video, Short, Reel, Post, Carousel, Story
- Mark days as done, edit content, add notes
- AI content brief per entry — hook, script, CTA, talking points
- Add multiple posts per day

### Analytics
- **Overview tab** — monthly activity chart, weekly posting consistency, upcoming posts
- **YouTube tab** — real channel stats via YouTube Analytics API
  - Daily views graph (extends to today, fills API lag with 0s)
  - Views, watch time, subscribers
  - Recent videos table with type badges
- Views calculated as max(analytics, video sum, channel stats) for accuracy

### Dashboard
- Real YouTube stats — subscribers, views, videos
- Upload activity chart (last 7 days, IST timezone)
- Posting streak from YouTube video publish dates
- Quick actions — Generator and Planner shortcuts
- Platform switcher — Overall / YouTube / Instagram

### Content Library
- Full video grid with thumbnails, type badges, duration
- Search and filter by type (Video, Short)
- Video detail panel — views, likes, comments, engagement rate, views/day, days since publish
- Instagram tab — Coming Soon

### Settings
- Edit profile — name, username, email, niche, bio
- Avatar upload with crop tool
- Platform switcher (YouTube / Instagram / Both)
- Change password
- Account deletion

---

## Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool |
| React Router 7 | Client-side routing |
| Recharts | Charts and graphs |
| Lucide React | Icons |
| Tailwind CSS | Utility styles |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express 5 | API server |
| MongoDB + Mongoose | Database |
| JWT + HTTP-only cookies | Authentication |
| Google APIs (googleapis) | YouTube Data + Analytics API |
| Groq (llama-3.3-70b) | AI content generation |
| Cloudinary | Avatar image storage |
| Multer | File upload handling |
| express-rate-limit | API rate limiting |
| bcrypt | Password hashing |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Database |
| Cloudinary | Media storage |
| GoDaddy | Domain (creatorstart.in) |

---

## Project Structure

```
CreatorStart/
├── frontend/
│   └── src/
│       ├── components/        # Sidebar, StreakCard
│       ├── constants/         # API endpoints, planner constants, storage keys
│       ├── pages/
│       │   ├── analytics/     # Overview + YouTube analytics
│       │   ├── auth/          # Login, register, OAuth callback
│       │   ├── content/       # Video library + detail panel
│       │   ├── dashboard/     # YT, IG, Both dashboards
│       │   ├── generator/     # AI content generator
│       │   ├── landing/       # Marketing landing page
│       │   ├── legal/         # Privacy + Terms
│       │   ├── planner/       # 30-day content planner
│       │   ├── platform/      # Platform selection
│       │   └── settings/      # Account settings
│       └── utils/             # apiFetch, youtubeStats helpers
│
└── backend/
    └── src/
        ├── controllers/       # auth, google (YouTube), planner (AI)
        ├── middleware/        # JWT auth, multer upload
        ├── models/            # User, Planner schemas
        ├── routes/            # auth.routes, planner.routes
        └── utils/             # ApiError, ApiResponse, asyncHandler, cloudinary
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud project with YouTube Data API v3 + YouTube Analytics API enabled
- Groq API key
- Cloudinary account

### Environment Variables

**Backend** (`backend/.env`):
```env
PORT=8000
MONGODB_URI=mongodb+srv://...
NODE_ENV=development

ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=10d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

GROQ_API_KEY=your_groq_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

### Installation

```bash
# Clone the repo
git clone https://github.com/v0idheaven/CreatorStart.git
cd CreatorStart

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev
```

Backend runs on `http://localhost:8000`  
Frontend runs on `http://localhost:5173`

---

## API Overview

### Auth Routes (`/api/v1/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login with email/password |
| POST | `/logout` | Logout (clears cookies) |
| POST | `/refresh` | Refresh access token |
| GET | `/me` | Get current user |
| PATCH | `/profile` | Update profile |
| PATCH | `/password` | Change password |
| PATCH | `/avatar` | Upload avatar |
| DELETE | `/account` | Delete account |
| GET | `/google` | Google OAuth redirect |
| GET | `/google/callback` | Google OAuth callback |
| POST | `/youtube/refresh` | Refresh YouTube channel stats |
| GET | `/youtube/videos` | Fetch all channel videos |
| GET | `/youtube/analytics` | Fetch analytics data |

### Planner Routes (`/api/v1/planner`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/plan` | Save planner data |
| GET | `/plan/:platform` | Get planner data |
| POST | `/streak` | Save streak data |
| GET | `/streak/:platform` | Get streak data |
| POST | `/ai/detail` | Generate AI content brief |
| POST | `/ai/content` | Generate content idea/script |
| POST | `/ai/score` | Score content quality |
| POST | `/ai/hooks` | Generate hook variations |
| POST | `/ai/tones` | Generate tone variants |

---

## Security

- JWT access tokens (1 day) + refresh tokens (10 days) via HTTP-only cookies
- Passwords hashed with bcrypt (10 rounds)
- OAuth users get cryptographically secure random passwords (`crypto.randomBytes`)
- Rate limiting — 200 req/15min general, 10 req/15min for login/register, 15 req/min for AI
- Input validation and length limits on all AI endpoints
- CORS restricted to known origins
- Sensitive fields excluded from all API responses

---

## License

MIT
