import { Router } from 'express';
import { getAllCourses, getCourseById, createCourse } from '../controllers/courseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/', authMiddleware, createCourse);

export default router;
