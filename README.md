# 🍒 Prohive — Social Media Platform

A full-stack social media app built with **MERN + Next.js + Redux Toolkit + Material UI + Framer Motion**.  
Theme: **Cherry Red & Warm White** · Font: Cormorant Garamond (headings) + Nunito (body)

---

## 📁 Project Structure

```
prohive/
├── frontend/                      ← Next.js 14 (App Router, pure JS)
│   └── src/
│       ├── app/
│       │   ├── page.js            ← redirects → /feed
│       │   ├── layout.js          ← root layout + font imports
│       │   ├── feed/page.js       ← home feed with stories + posts
│       │   ├── explore/page.js    ← discover people, posts, tags
│       │   ├── notifications/page.js
│       │   ├── profile/[username]/page.js  ← full profile + edit modal
│       │   └── auth/
│       │       ├── login/page.js
│       │       └── register/page.js
│       ├── components/
│       │   ├── common/            ← Providers.js, GlobalSnackbar.js
│       │   ├── layout/            ← Sidebar.js, AppLayout.js, RightSidebar.js
│       │   ├── post/              ← PostCard.js ★, CreatePostModal.js
│       │   └── story/             ← StoriesBar.js
│       ├── store/
│       │   ├── index.js           ← Redux store + redux-persist
│       │   └── slices/
│       │       ├── authSlice.js
│       │       ├── postSlice.js   ← optimistic like, comment, save, delete
│       │       ├── profileSlice.js
│       │       ├── uiSlice.js
│       │       └── notificationSlice.js
│       └── lib/
│           ├── theme.js           ← MUI Cherry & White theme
│           └── api.js             ← axios instance with auto auth headers
│
└── backend/                       ← Express + MongoDB
    └── src/
        ├── server.js              ← Express + Socket.IO + MongoDB connect
        ├── models/
        │   ├── User.js
        │   ├── Post.js
        │   └── Notification.js
        ├── controllers/
        │   ├── authController.js
        │   ├── postController.js  ← toggleLike with real-time notifs
        │   └── userController.js
        ├── routes/
        │   ├── auth.js
        │   ├── posts.js
        │   ├── users.js
        │   ├── notifications.js
        │   └── stories.js
        └── middleware/
            └── auth.js            ← JWT protect middleware
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔴 **Working Like Button** | Optimistic UI (instant) + spring animation + heart particle burst on like + double-tap image |
| 💬 **Comments** | Inline expand/collapse, press Enter to submit, real-time add |
| 🔖 **Save Posts** | Toggle save with animated bookmark icon |
| 👤 **Full Profile** | Cover banner, gradient avatar ring, stats, tabs (Posts/Saved/Liked), Edit modal |
| 🔔 **Notifications** | Real-time via Socket.IO, mark all read, type icons |
| 📖 **Stories Bar** | Scrollable story rings with gradient border |
| 🔍 **Explore** | Posts grid, People cards with Follow, Tags search |
| 🎨 **Cherry Theme** | Deep cherry `#C0392B`, warm white `#FDF6F0`, coral accents |
| 📱 **Responsive** | Collapsible sidebar (desktop) + bottom nav (mobile) |
| 🔐 **Auth** | JWT login/register with password strength meter |
| ⚡ **Redux Persist** | Auth state survives page refresh |

---

## 🚀 Setup & Run

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
# Runs on http://localhost:3000
```

### MongoDB
- **Local**: `mongod` must be running, default URI is `mongodb://localhost:27017/prohive`
- **Atlas**: Replace `MONGODB_URI` in `.env` with your Atlas connection string

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) · Pure JavaScript |
| State | Redux Toolkit · Redux Persist |
| UI | Material UI v5 |
| Animation | Framer Motion |
| Forms | React Hook Form |
| Backend | Express.js |
| Database | MongoDB · Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Real-time | Socket.IO |
| Images | Drag & drop via react-dropzone |

---

## 📝 Notes

- The feed and notifications pages include **demo data** so the UI looks great even without a backend running
- To use with a real backend: ensure MongoDB is running and both servers are started
- Cloudinary integration is optional — set credentials in backend `.env` for real image upload
