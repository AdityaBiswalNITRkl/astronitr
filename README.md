# ASTRONITR Website — Full-Stack

A separate, self-contained codebase that combines the **ASTRONITR landing-site UI/UX** (Next.js + Tailwind v4 + WebGL Galaxy + Spline 3D) with the **complete AstroNITR Platform backend** (Express 5 + MongoDB), wired together into one functional website.

## Structure

```
astronitr-website/
├── client/   → Next.js frontend (astonitr UI/UX, extended with all platform features)
└── server/   → Express backend (all AstroNITR Platform functionality)
```

## Quick Start

### 1. Backend

```bash
cd server
npm install
npm run dev          # runs on http://localhost:5000
```

Requires a `.env` (already copied from the Platform repo) with:
`PORT, MONGODB_URI, JWT_SECRET, CLOUDINARY_*, NASA_API_KEY, GEMINI_API_KEY, NEWS_API_KEY`

### 2. Frontend

```bash
cd client
npm install
npm run dev          # runs on http://localhost:3000
```

`client/.env.local` sets `NEXT_PUBLIC_API_URL=http://localhost:5000`.

Create an admin by registering, then updating your role in MongoDB (`users` collection → set `role: "admin"`, `isApproved: true`).

## Features (all backend functions wired)

| Area | Endpoints used | UI |
|---|---|---|
| Auth | register / login / profile | `/register`, `/login`, JWT in localStorage |
| Events | list/detail/create/update/approve/delete + banner upload | `/events`, `/events/[id]`, Dashboard → Events |
| RSVP & attendance | registrations me/all/per-event/mark | Event pages, My RSVPs, Attendance console |
| Blogs | approved/pending/mine, create/edit/delete, like, comment, approve/reject | `/blogs`, `/blogs/[id]`, write page, Blog Queue tab |
| Gallery | list/all/upload/approve/delete | `/gallery` + lightbox, Gallery admin |
| Announcements | CRUD w/ pin & expiry | Dashboard → Announcements |
| Team | CRUD/approve + photo & socials | `/team`, Team admin |
| Newsletters | CRUD + rich content viewer | `/newsletters`, Newsletter admin |
| Contact | submit / inbox / status / delete | Home & `/contact` form, Inbox tab |
| Users & roles | pending approvals, role change, delete | Admin → Users |
| NASA APOD | `/api/nasa/apod` | Home "Cosmos Today" |
| AI daily fact | `/api/ai/daily-fact` | Home "Cosmos Today" |
| AI news digest | `/api/news` | Home "Today In Space" |

## Design

The original astonitr look is preserved exactly: Orbitron/Inter typography, `#050816` space-black theme, neon cyan→purple gradients, the ogl WebGL starfield background, Spline hero scene, and GooeyNav navigation.
