# TaskFlow — Frontend 🎨

React 18 + Vite frontend for the TaskFlow todo application with JWT authentication.

## 🌐 Live App
`https://taskflow-frontend-five-coral.vercel.app`

## 🛠️ Tech Stack
- React 18 + Vite
- Tailwind CSS v4
- React Router v6
- Axios
- react-hot-toast
- Context API (auth state)

## ✨ Features
- 🔐 Register & Login with JWT
- 📋 Private task list per user
- ➕ Add tasks with title, priority (High/Medium/Low), and due date
- ✅ Toggle tasks complete / incomplete
- 🗑️ Delete tasks
- 🔍 Search tasks by title
- 🎯 Filter by All / Active / Completed + priority
- 📊 Stats bar — Total, Completed, Pending, Overdue
- ⚠️ Overdue tasks highlighted in red
- 🔑 Password strength indicator on register
- 🔔 Toast notifications on every action
- 📱 Fully responsive dark UI

## 📁 Folder Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js           # Axios instance with JWT interceptor
│   ├── components/
│   │   ├── Navbar.jsx         # Top nav with logout
│   │   ├── PrivateRoute.jsx   # Redirect to /login if no token
│   │   ├── StatsBar.jsx       # Task count stats
│   │   ├── TaskCard.jsx       # Individual task card
│   │   └── TaskForm.jsx       # Add new task form
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state + localStorage
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx       # With password strength indicator
│   │   └── Dashboard.jsx      # Main app page
│   ├── App.jsx                # Routes
│   └── main.jsx
├── vercel.json                # SPA routing fix
└── index.html
```

## ⚙️ Local Setup

### 1. Clone & install
```bash
git clone https://github.com/M-Nikhita/taskflow-frontend.git
cd taskflow-frontend
npm install
```

### 2. Configure environment
Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

> Leave `VITE_API_URL` empty to use the built-in Vite dev proxy instead.

### 3. Run
```bash
npm run dev
```

App runs on `http://localhost:5173`

> ⚠️ Make sure the backend is running on port 5000 first.

## 🚀 Deployment
Deployed on **Vercel** (free tier).
- Framework: Vite
- Set `VITE_API_URL=https://taskflow-backend-pvby.onrender.com` in Vercel environment variables
- `vercel.json` handles SPA client-side routing

## 🔗 Backend Repo
https://github.com/M-Nikhita/taskflow-backend
