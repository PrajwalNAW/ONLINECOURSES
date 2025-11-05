# 🚀 Quick Start Guide - Online Courses Referral Platform

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Git
- Code editor (VS Code recommended)

---

## ⚡ Backend Setup (5 minutes)

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Environment is already configured
Your `.env` file is ready with MongoDB Atlas connection.

### 3. Install dependencies (if not done)
```bash
npm install
```

### 4. Seed the database with sample courses
```bash
npm run seed
```

Expected output:
```
Connected to MongoDB
Cleared existing courses
✅ Successfully seeded 6 courses
```

### 5. Start the backend server
```bash
npm run dev
```

Server will start on **http://localhost:5000**

### ✅ Backend Ready!

Test it: Open http://localhost:5000 in your browser
You should see: `{"message":"API is running..."}`

---

## 🎨 Frontend Setup (Implementation Needed)

The frontend structure and core files have been created. You need to implement the pages:

### Required Pages to Create:

1. **`app/page.tsx`** - Landing page
2. **`app/login/page.tsx`** - Login page
3. **`app/register/page.tsx`** - Registration with referral detection
4. **`app/dashboard/page.tsx`** - Referral dashboard
5. **`app/courses/page.tsx`** - Course listing
6. **`app/courses/[id]/page.tsx`** - Course details & purchase

### Files Already Created:
- ✅ `lib/api.ts` - API client with axios
- ✅ `store/authStore.ts` - Zustand authentication store
- ✅ `types/index.ts` - TypeScript interfaces
- ✅ `.env.local` - Environment variables

### To implement frontend:

```bash
cd frontend
npm install  # Install dependencies
npm run dev  # Start development server
```

Frontend will run on **http://localhost:3000**

---

## 📋 Testing the Referral Flow

### Test Scenario: Lina refers Ryan

#### Step 1: Register User 1 (Lina)
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Lina Smith",
  "email": "lina@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "...",
    "name": "Lina Smith",
    "email": "lina@example.com",
    "referralCode": "LINA5X2Y",  // ← Copy this code
    "credits": 0
  }
}
```

#### Step 2: Register User 2 (Ryan) with Lina's referral code
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Ryan Johnson",
  "email": "ryan@example.com",
  "password": "password123",
  "referralCode": "LINA5X2Y"  // ← Lina's code
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "...",
    "name": "Ryan Johnson",
    "email": "ryan@example.com",
    "referralCode": "RYAN8K3M",
    "credits": 0
  }
}
```

#### Step 3: Get a course ID
```bash
GET http://localhost:5000/api/courses
```

**Response:**
```json
{
  "courses": [
    {
      "_id": "67890abc...",  // ← Copy this course ID
      "title": "Complete Web Development Bootcamp",
      "price": 99.99,
      ...
    }
  ]
}
```

#### Step 4: Ryan makes first purchase
```bash
POST http://localhost:5000/api/purchases
Authorization: Bearer <Ryan's token>
Content-Type: application/json

{
  "courseId": "67890abc..."  // ← Course ID from step 3
}
```

**Response:**
```json
{
  "message": "Purchase successful",
  "purchase": {
    "id": "...",
    "course": "Complete Web Development Bootcamp",
    "amount": 99.99,
    "creditsEarned": 2  // ← Ryan earned 2 credits!
  }
}
```

#### Step 5: Check Lina's dashboard
```bash
GET http://localhost:5000/api/referrals/dashboard
Authorization: Bearer <Lina's token>
```

**Response:**
```json
{
  "referralCode": "LINA5X2Y",
  "referralLink": "http://localhost:3000/register?r=LINA5X2Y",
  "metrics": {
    "totalReferred": 1,
    "convertedUsers": 1,  // ← Ryan converted!
    "totalCreditsEarned": 2  // ← Lina earned 2 credits!
  },
  "referredUsers": [
    {
      "id": "...",
      "name": "Ryan Johnson",
      "email": "ryan@example.com",
      "status": "converted",  // ← Status changed to converted
      "hasPurchased": true,
      "joinedAt": "2025-11-05...",
      "convertedAt": "2025-11-05..."
    }
  ]
}
```

#### Step 6: Verify both users have credits
```bash
# Check Lina
GET http://localhost:5000/api/auth/me
Authorization: Bearer <Lina's token>

# Check Ryan
GET http://localhost:5000/api/auth/me
Authorization: Bearer <Ryan's token>
```

Both should show `"credits": 2` ✅

---

## 🧪 Using Postman/Thunder Client

### Import this collection:

1. **Register Lina**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body: 
     ```json
     {
       "name": "Lina Smith",
       "email": "lina@test.com",
       "password": "password123"
     }
     ```

2. **Login Lina**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body:
     ```json
     {
       "email": "lina@test.com",
       "password": "password123"
     }
     ```

3. **Get Lina's Dashboard**
   - Method: GET
   - URL: `http://localhost:5000/api/referrals/dashboard`
   - Headers: `Authorization: Bearer <token>`

4. **Get All Courses**
   - Method: GET
   - URL: `http://localhost:5000/api/courses`

5. **Register Ryan with Referral**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body:
     ```json
     {
       "name": "Ryan Johnson",
       "email": "ryan@test.com",
       "password": "password123",
       "referralCode": "LINA_CODE_HERE"
     }
     ```

6. **Ryan Buys Course**
   - Method: POST
   - URL: `http://localhost:5000/api/purchases`
   - Headers: `Authorization: Bearer <Ryan's token>`
   - Body:
     ```json
     {
       "courseId": "COURSE_ID_HERE"
     }
     ```

---

## 📊 Available Courses (Seeded)

After running `npm run seed`, you have these courses:

1. **Complete Web Development Bootcamp** - $99.99 (Beginner)
2. **Advanced TypeScript Programming** - $79.99 (Advanced)
3. **React + Next.js Complete Guide** - $89.99 (Intermediate)
4. **MongoDB & Database Design Masterclass** - $69.99 (Intermediate)
5. **Machine Learning with Python** - $119.99 (Intermediate)
6. **UI/UX Design Fundamentals** - $59.99 (Beginner)

---

## 🔑 Key API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login user |
| `/api/auth/me` | GET | Yes | Get current user |
| `/api/courses` | GET | No | Get all courses |
| `/api/courses/:id` | GET | No | Get course by ID |
| `/api/purchases` | POST | Yes | Purchase a course |
| `/api/purchases/my-purchases` | GET | Yes | Get user's purchases |
| `/api/referrals/dashboard` | GET | Yes | Get referral dashboard |
| `/api/referrals/validate/:code` | GET | No | Validate referral code |

---

## 🎯 Business Rules Verification

### ✅ Checklist:

- [ ] User gets unique referral code on signup
- [ ] Referral code is 8 characters (uppercase alphanumeric)
- [ ] New user can sign up with referral code
- [ ] Referral relationship is recorded in database
- [ ] First purchase triggers credit award
- [ ] Both referrer and referred get 2 credits each
- [ ] Referral status changes from "pending" to "converted"
- [ ] Second purchase does NOT award additional credits
- [ ] Dashboard shows correct metrics
- [ ] Referred users list shows correct status
- [ ] Transaction ensures data integrity

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:** Check your `.env` file has correct `MONGO_URI`

### Issue: "No courses found"
**Solution:** Run `npm run seed` to populate courses

### Issue: "Token is not valid"
**Solution:** Token might be expired. Login again to get a new token

### Issue: "Port 5000 already in use"
**Solution:** Change PORT in `.env` or kill the process using port 5000

### Issue: "CORS error in frontend"
**Solution:** Ensure backend has CORS enabled (already configured)

---

## 📱 Next Steps

1. ✅ Backend is complete and ready
2. 🏗️ Implement frontend pages using code from `PROJECT_SUMMARY.md`
3. 🎨 Style with Tailwind CSS
4. ✨ Add Framer Motion animations
5. 🧪 Test complete user flow
6. 🚀 Deploy to Vercel (frontend) + Render (backend)

---

## 📚 Documentation

- **Complete Guide**: See `PROJECT_SUMMARY.md`
- **API Documentation**: See `backend/README.md`
- **Frontend Implementation**: See code examples in `PROJECT_SUMMARY.md`
- **UML Diagrams**: Available in `PROJECT_SUMMARY.md`

---

## 💡 Tips

- Use **Postman** or **Thunder Client** for testing APIs
- Keep backend running while developing frontend
- Check browser console for errors
- Use MongoDB Compass to visualize database
- Test referral flow with different users

---

## 🎉 You're All Set!

**Backend Status**: ✅ 100% Complete and Running
**Frontend Status**: 🏗️ Ready for Implementation
**Database**: ✅ Connected and Seeded

Happy coding! 🚀
