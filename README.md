# OnlineCourses

OnlineCourses is a full‑stack learning platform (Next.js + Tailwind + Zustand; Express + TypeScript + MongoDB) to browse and purchase courses with a responsive, modern UI.

Users get unique referral codes: new users start with 2 coins. On referral signup the referrer earns 8 coins and the friend earns 4 coins. On the friend’s first purchase the referrer earns 10 more coins. Every course costs 10 coins and buying deducts 10 coins from the buyer. Profile shows coins, referral link/code, and purchased courses; the catalog features styled category cards and one‑click buying for 10 coins that records to the user’s profile.

## Monorepo layout

- `frontend/` — Next.js app (App Router)
- `backend/` — Express + TypeScript API with MongoDB via Mongoose

---

## Tech Stack

- Frontend
  - Next.js 16, React 19
  - Tailwind CSS v4
  - Axios for HTTP
  - Zustand for client auth state
- Backend
  - Node.js, Express 4 (TypeScript)
  - Mongoose 8 (MongoDB ODM)
  - JWT (jsonwebtoken) for auth, bcrypt for password hashing
  - dotenv, cors
- Database
  - MongoDB (local or Atlas)
- Security
  - JWT Bearer auth middleware
  - Bcrypt password hashing with per-user salt
  - CORS restricted to frontend origin
  - Unique indexes to prevent duplicate purchases and ensure referral-code uniqueness
  - Mongoose transactions for atomic referral coin awards on purchase

---

## Features

- Authentication (register/login), JWT stored in localStorage on the client
- Unique referral code per user, referral link `Register?r=CODE`
- Referral & coin system
  - New account: +2 coins to the user by default
  - Referral signup: +8 coins to referrer, +4 coins to friend
  - Friend’s first purchase: +10 coins to referrer
  - Course cost: each course costs 10 coins; buying deducts 10 coins from the buyer
- Courses catalog with stylish category cards; intro card hidden for logged-in users
- One-click “Buy” creates purchase, updates coins and profile
- Profile dashboard: avatar, email, coin balance, referral code/link with copy, purchases list

---

## Getting Started

Prerequisites: Node 18+ (recommended 20+), MongoDB running (local `mongodb://localhost:27017` or Atlas connection URI).

### 1) Backend setup

Create `backend/.env` (see variables below), then:

```bash
cd backend
npm install
npm run dev
```

Seed example courses (optional):

```bash
npm run seed
```

### 2) Frontend setup

Create `frontend/.env.local` (see variables below), then:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### Environment variables

Backend (`backend/.env`):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your-very-secret-key
FRONTEND_URL=http://localhost:3000
```

Frontend (`frontend/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Data Model

- User
  - `email` (unique), `password` (hashed with bcrypt), `name`
  - `referralCode` (unique, uppercase A–Z0–9)
- `credits` (number of coins; defaults to 2 for new users)
  - `referredBy` (ObjectId<User> | null)
  - `hasPurchased` (boolean, first purchase tracking)
- Referral
  - `referrer` (ObjectId<User>)
  - `referred` (ObjectId<User>)
  - `status` ("pending" | "converted")
- `signupAwarded` (boolean) — referral signup coins already given (+8 to referrer, +4 to friend)
- `purchaseAwarded` (boolean) — 10 coins to referrer already given on friend’s first purchase
  - `convertedAt`, `createdAt`
- Course
  - `title`, `description`, `instructor`, `price`, `duration`, `level`, `thumbnail`, `category`, `createdAt`
- Purchase
- `user`, `course`, `amount` (coins spent; 10), `creditsEarned`, `isFirstPurchase`, `purchaseDate`
  - Unique index: `{ user: 1, course: 1 }`

---

## Backend Logic (Detailed)

Constants used:

- `START_COINS = 2`
- `SIGNUP_REFERRER_COINS = 8`
- `SIGNUP_FRIEND_COINS = 4`
- `PURCHASE_REFERRER_COINS = 10`
- `COURSE_COST_COINS = 10`

### 1) Registration (`POST /api/auth/register`)

Request body: `{ name, email, password, referralCode? }`

Flow:
1. Check if email already exists. If yes → 400.
2. Generate a unique `referralCode` using nanoid with alphabet `A–Z0–9`, length 8; ensure uniqueness in DB.
3. If `referralCode` provided, find referrer by code (case-insensitive).
4. Create the new user (defaults to 2 coins); set `referredBy` if a referrer was found.
5. If referred:
   - Create `Referral { referrer, referred }` with default `status: 'pending'`.
   - Award signup coins: `+8` to referrer and `+4` to the new user.
   - Mark `referral.signupAwarded = true`.
6. Issue JWT `{ userId }` (7d expiry) and return user info.

Security:
- Password is hashed with bcrypt (pre-save hook on User model).
- Only returns non-sensitive user fields.

### 2) Login (`POST /api/auth/login`)

- Verify user by email and `comparePassword(password)`.
- Issue JWT on success and return user info.

### 3) Get current user (`GET /api/auth/me`)

- Protected by `Authorization: Bearer <token>`; middleware verifies JWT and sets `req.userId`.
- Returns the user document (without password).

### 4) Validate referral code (`GET /api/referrals/validate/:code`)

- Public endpoint to confirm a code exists and return referrer name.

### 5) Referral dashboard (`GET /api/referrals/dashboard`)

- Requires auth. Returns:
  - `referralCode`
  - `referralLink` (uses `FRONTEND_URL`)
  - `metrics` (total referred, converted users, total credits earned)
  - `referredUsers` (list with status and dates)

### 6) Create purchase (`POST /api/purchases`)

Request body: `{ courseId }` (requires auth)

Atomic flow using a Mongoose session/transaction:
1. Verify course exists; ensure the user has not already purchased it (unique constraint).
2. Load user; require `user.credits >= 10` else 400 "Insufficient coins".
3. Compute `isFirstPurchase = !user.hasPurchased`.
4. If first purchase and user was referred:
   - Load the `Referral { referrer, referred }` record.
   - If `purchaseAwarded` is false → award `+10` coins to the referrer; set `status = 'converted'`, `purchaseAwarded = true`, `convertedAt = now()`.
5. Deduct `10` coins from user and set `hasPurchased = true`.
6. Create the `Purchase` with `amount = 10` and `creditsEarned` (0 for buyer) and `isFirstPurchase`.
7. Commit the transaction; on any error abort and return 500.

### 7) Get my purchases (`GET /api/purchases/my-purchases`)

- Requires auth; returns list of purchases for the user, populated with `course` and sorted by `purchaseDate desc`.

---

## API Summary

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Referrals
  - `GET /api/referrals/validate/:code`
  - `GET /api/referrals/dashboard` (auth)
- Courses
  - `GET /api/courses`
  - `GET /api/courses/:id`
  - `POST /api/courses` (auth — treat as admin only in real apps)
- Purchases
  - `POST /api/purchases` (auth)
  - `GET /api/purchases/my-purchases` (auth)

Example: create purchase

```http
POST /api/purchases
Authorization: Bearer <token>
Content-Type: application/json

{ "courseId": "<courseObjectId>" }
```

---

## Frontend Overview

- Global header with gradient CTA, animated nav, and mobile drawer
- Home hero with gradient headline and CTAs
- Courses page
  - Large intro card (hidden when logged in)
  - Category cards with image overlays and a “Buy for 10 coins” quick action
- Register page
  - Reads `?r=CODE`, validates the code, and pre-fills the field
- Login page
  - Stores JWT to localStorage; Axios interceptor attaches `Authorization` header
- Profile page
  - Gradient user card with avatar initial, email, and coin badge
  - Referral card with copy-to-clipboard link and code
- Purchases grid with coin-spent pill and coin delta

State management: lightweight auth store via Zustand (`frontend/store/auth.ts`).

---

## Screenshots

Note: Place your screenshots in `docs/screenshots/` with the names below (or update the paths).

- Home hero
<img width="1920" height="1080" alt="Screenshot 2025-10-09 092725" src="frontend/public/Home.png" />

- Available Courses grid (intro card + category cards)
<img width="1920" height="1080" alt="Screenshot 2025-10-09 092725" src="frontend/public/Available Courses.png" />

- Profile (Referrer after friend purchased — shows earnings from a referral: +8 on friend signup and +10 on their first purchase)
<img width="1920" height="1080" alt="Screenshot 2025-10-09 092725" src="frontend/public/profile-referrer.png" />

- Profile (Friend after signup — shows +4 coins reward from referral)
<img width="1920" height="1080" alt="Screenshot 2025-10-09 092725" src="frontend/public/profile-friend.png" />

How this maps to backend logic:
- When A refers B and B signs up using A’s code, A immediately gets +8 coins and B gets +4 coins (B also starts with +2 by default).
- When B makes their first purchase, A gets +10 coins. The purchase costs B 10 coins.

---

## Development Notes & Decisions

- Referral code generation uses `nanoid` with alphabet `A–Z0–9` length 8
- Coin awards split into signup and first-purchase phases using flags on `Referral`
- Unique indexes guarantee consistency; transactions keep multi-document updates atomic
- The example includes only basic authorization; for admin, add roles/permissions
- Consider adding validation library (e.g., Zod/celebrate), rate limiting, and email verification in production

---

## Scripts

Backend (in `backend/`):

- `npm run dev` — start dev server with ts-node-dev
- `npm run build && npm start` — build and run
- `npm run seed` — seed sample courses

Frontend (in `frontend/`):

- `npm run dev` — Next.js dev server
- `npm run build && npm start` — production build

---

## License

This project is provided as-is for educational purposes.
