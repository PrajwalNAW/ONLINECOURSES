import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Course from '../models/Course';

dotenv.config();

const courses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, Node.js, React, and MongoDB from scratch. Build real-world projects and become a full-stack developer.',
    instructor: 'Dr. Angela Yu',
    price: 99.99,
    duration: '65 hours',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    category: 'Web Development',
  },
  {
    title: 'Advanced TypeScript Programming',
    description: 'Master TypeScript with advanced patterns, generics, decorators, and build enterprise-level applications.',
    instructor: 'Maximilian Schwarzmüller',
    price: 79.99,
    duration: '28 hours',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    category: 'Programming',
  },
  {
    title: 'React + Next.js Complete Guide',
    description: 'Build modern, scalable web applications with React 18, Next.js 14, and server components.',
    instructor: 'Maximilian Schwarzmüller',
    price: 89.99,
    duration: '42 hours',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: 'Frontend Development',
  },
  {
    title: 'MongoDB & Database Design Masterclass',
    description: 'Learn MongoDB from basics to advanced, including aggregation, indexing, and performance optimization.',
    instructor: 'Stephen Grider',
    price: 69.99,
    duration: '22 hours',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    category: 'Database',
  },
  {
    title: 'Machine Learning with Python',
    description: 'Learn machine learning algorithms, data science, and AI with hands-on Python projects.',
    instructor: 'Andrew Ng',
    price: 119.99,
    duration: '55 hours',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    category: 'Data Science',
  },
  {
    title: 'UI/UX Design Fundamentals',
    description: 'Master user interface and user experience design principles. Learn Figma, prototyping, and design thinking.',
    instructor: 'Daniel Schifano',
    price: 59.99,
    duration: '18 hours',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    category: 'Design',
  },
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';
    await mongoose.connect(mongoURI);
    
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert new courses
    await Course.insertMany(courses);
    console.log(`✅ Successfully seeded ${courses.length} courses`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
