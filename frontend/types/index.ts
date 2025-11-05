export interface User {
  id: string;
  email: string;
  name: string;
  referralCode: string;
  credits: number;
  hasPurchased: boolean;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  category: string;
  createdAt: string;
}

export interface Purchase {
  _id: string;
  user: string;
  course: Course;
  amount: number;
  creditsEarned: number;
  isFirstPurchase: boolean;
  purchaseDate: string;
}

export interface ReferredUser {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'converted';
  hasPurchased: boolean;
  joinedAt: string;
  convertedAt?: string;
}

export interface DashboardData {
  referralCode: string;
  referralLink: string;
  metrics: {
    totalReferred: number;
    convertedUsers: number;
    totalCreditsEarned: number;
  };
  referredUsers: ReferredUser[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  error?: unknown;
}
