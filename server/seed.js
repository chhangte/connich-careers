const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config();

const jobs = [
  {
    title: 'Primary School Teacher',
    description: 'We are looking for a passionate Primary School Teacher to join our academic team. The ideal candidate will be responsible for creating a positive and nurturing learning environment for students.',
    requirements: [
      'Bachelor’s degree in Education or related field',
      'Proven experience as a teacher',
      'Excellent communication and interpersonal skills',
      'Passion for working with children'
    ],
    location: 'Mumbai, MH',
    department: 'Academic',
    salary: '₹4,00,000 - ₹6,00,000 PA',
    status: 'OPEN'
  },
  {
    title: 'Music Instructor',
    description: 'Seeking a talented Music Instructor to lead our music department. You will be teaching students various instruments and vocal techniques.',
    requirements: [
      'Degree in Music or Fine Arts',
      'Proficiency in at least two instruments',
      'Previous teaching experience preferred',
      'Ability to organize school concerts'
    ],
    location: 'Pune, MH',
    department: 'Arts',
    salary: '₹3,50,000 - ₹5,00,000 PA',
    status: 'OPEN'
  },
  {
    title: 'Admin Executive',
    description: 'We need an organized Admin Executive to handle day-to-day operations and office management tasks.',
    requirements: [
      'Any Graduate',
      'Strong organizational skills',
      'Proficiency in MS Office',
      'Good communication skills'
    ],
    location: 'Remote / Hybrid',
    department: 'Administration',
    salary: '₹3,00,000 - ₹4,50,000 PA',
    status: 'OPEN'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas...');

    // Data clearing has been removed to prevent accidental data loss.

    // Create a Recruiter
    const recruiter = new User({
      name: 'Admin Recruiter',
      email: 'recruiter@connich.com',
      password: 'password123',
      role: 'RECRUITER'
    });
    await recruiter.save();
    console.log('Created test recruiter...');

    // Add postedBy to jobs
    const jobsWithRecruiter = jobs.map(job => ({
      ...job,
      postedBy: recruiter._id
    }));

    await Job.insertMany(jobsWithRecruiter);
    console.log('Seeded jobs successfully!');

    process.exit();
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
};

seedDB();
