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

**Frontend**
React (Vite), Tailwind CSS

**Backend**
Node.js, Express.js

---

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

Create a `.env` file:

```id="dr5y9m"
PORT=5000
```

---

### Frontend

```id="d1b4kw"
cd frontend
npm install
npm run dev
```

---

## Environment Variables

```id="ny6g8s"
PORT=5000
```

---

## Next Steps

* Implement planner UI and connect with backend
* Add database integration
* Build dashboard and content generation features
* Improve error handling and API validation

---

## Author

Varun Yadav
