# AI Portal — Full Stack Job Portal with AI Features

A full-stack AI-powered job portal supporting Jobseekers, Recruiters, and Admins.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/PrathmeshSurwase6250/AI-PORTAL)

## Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS 4, Redux Toolkit, Firebase (Google Auth)
- **Backend**: Node.js, Express 5, MongoDB (Mongoose), JWT Auth
- **AI**: OpenRouter API (GPT-4o-mini)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- OpenRouter API key

### 1. Clone the repo
```bash
git clone <repo-url>
cd "Final Year Project"
```

### 2. Setup Backend
```bash
cd Backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev       # Runs on http://localhost:3000
```

### 3. Setup Frontend
```bash
cd Frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:3000 in .env
npm install
npm run dev       # Runs on http://localhost:5173
```

---

## 🌐 Deployment

### Backend (Render / Railway / Fly.io)
1. Set all environment variables from `Backend/.env.example`
2. Set `NODE_ENV=production`
3. Set `CLIENT_URL=https://your-frontend-domain.com`
4. Build command: `npm install`
5. Start command: `npm start`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL=https://your-backend-domain.com`
2. Set `VITE_FIREBASE_APIKEY=your_key`
3. Build command: `npm run build`
4. Output directory: `dist`
5. For React Router (client-side routing), add a redirect rule:
   - **Netlify**: Create `public/_redirects` with `/* /index.html 200`
   - **Vercel**: Add `"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]` to `vercel.json`

---

## 📁 Project Structure
```
Final Year Project/
├── Backend/
│   ├── .env              # Your local env (gitignored)
│   ├── .env.example      # Template — copy to .env
│   ├── Server.js         # Express app entry point
│   ├── config/           # DB, Multer config
│   ├── controllers/      # Route handlers
│   ├── middelwares/      # Auth, Role, Multer middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── services/         # OpenRouter AI service
│   └── util/             # JWT, Email utilities
└── Frontend/
    ├── .env              # Your local env (gitignored)
    ├── .env.example      # Template — copy to .env
    ├── src/
    │   ├── config/       # Server URL (reads from env)
    │   ├── pages/        # Route pages
    │   ├── components/   # Reusable UI components
    │   ├── services/     # Axios API call functions
    │   ├── redux/        # Redux store & slices
    │   └── layouts/      # Page layouts
    └── vite.config.js    # Vite + Tailwind config
```

---

## 👤 User Roles
| Role | Access |
|------|--------|
| `jobseeker` | Browse jobs, apply, build resume, take AI interviews |
| `recruiter` | Post/manage jobs, view applicants |
| `admin` | Full access — manage users, jobs, applications, feedback |

## 🔑 Admin Login
Use `/auth` page and click "Admin Login" (credentials set via `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars).
