# Online Courses Referral Platform - Backend

A production-ready REST API for a referral program system built with Express, TypeScript, MongoDB, and JWT authentication.

## Features

- 🚀 Express.js with TypeScript
- 🔐 JWT Authentication with bcrypt password hashing
- 🗄️ MongoDB Atlas with Mongoose ODM
- 🎁 **Referral System** - Unique codes, tracking, credit awards
- 💰 **Purchase System** - First purchase credit distribution
- 📊 **Dashboard API** - Aggregated metrics and referred users
- 🔄 MongoDB Transactions for data integrity
- 🌱 Database seeder with sample courses
- 🌐 CORS enabled
- 📝 Environment variables with dotenv

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database and app configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware (auth, etc.)
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.ts       # App entry point
├── dist/               # Compiled JavaScript (generated)
├── .env                # Environment variables (create this)
├── .env.example        # Environment variables template
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   - Set `MONGO_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Adjust `PORT` if needed

### Running the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/me` - Get current user (requires authentication)
  - Header: `Authorization: Bearer <token>`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/myapp |
| JWT_SECRET | Secret key for JWT | your-super-secret-jwt-key |
| NODE_ENV | Environment | development |

## Scripts

- `npm run dev` - Run development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing
- **ts-node-dev** - TypeScript execution with hot reload

## License

ISC
