import { Request, Response } from 'express';
import Course from '../models/Course';

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course', error });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, instructor, price, duration, level, thumbnail, category } = req.body;

    const course = new Course({
      title,
      description,
      instructor,
      price,
      duration,
      level,
      thumbnail,
      category,
    });

    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course', error });
  }
};
