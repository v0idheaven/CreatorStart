# CreatorStart

CreatorStart is a content planning platform built for beginner YouTube and Instagram creators. It helps users organize their content, stay consistent, and plan growth with structured workflows.

---

## Current Progress

* Frontend and backend scaffolded
* Environment setup completed
* Basic backend API structure (user and planner routes)
* Health and status endpoints implemented

---

## Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database & Auth:** Supabase   
**AI (planned):** OpenAI / Gemini API

## Project Structure

```id="xq8m2l"
CreatorStart/
├── backend/
│   └── src/
│       ├── index.js
│       └── routes/
│           ├── user.routes.js
│           └── planner.routes.js
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── App.jsx
```

---

## API Endpoints

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| GET    | /api/health  | Health check      |
| GET    | /api/status  | Server status     |
| GET    | /api/user/me | Fetch user data   |
| GET    | /api/planner | Get planner data  |
| POST   | /api/planner | Save planner data |

---

## Getting Started

### Backend

```id="boc1hd"
cd backend
npm install
npm run dev
```
---

### Frontend

```id="d1b4kw"
cd frontend
npm install
npm run dev
```

---

## Authors

- Varun Yadav
- Om Manoj Hire
