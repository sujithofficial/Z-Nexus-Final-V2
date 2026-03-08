import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Event from './models/Event.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const sampleEvents = [
    {
        title: 'Code Conquest',
        description: 'A multi-level coding challenge where individual brilliance meets complex algorithms.',
        rules: '1. No plagiarism allowed.\n2. Standard compilers will be provided.\n3. Time limit is 2 hours.\n4. Judgment based on efficiency and accuracy.',
        venue: 'Computing Lab 1',
        date: 'March 25th, 10:00 AM',
        eventType: 'Individual',
        maxTeamSize: 1,
        coordinatorName: 'Rahul Kumar',
        coordinatorPhone: '9876543210'
    },
    {
        title: 'Biz Pitch',
        description: 'Present your revolutionary business ideas to a panel of expert entrepreneurs.',
        rules: '1. 10 minutes for presentation.\n2. 5 minutes for Q&A.\n3. Pitch deck required in PPT/PDF format.\n4. Teams of up to 3 allowed.',
        venue: 'Main Seminar Hall',
        date: 'March 25th, 02:00 PM',
        eventType: 'Team',
        maxTeamSize: 3,
        coordinatorName: 'Sneha Gupta',
        coordinatorPhone: '9123456789'
    },
    {
        title: 'Cyber Siege',
        description: 'A capture-the-flag style event testing your network security and ethical hacking skills.',
        rules: '1. Teams of 2.\n2. Personal laptops allowed.\n3. Strictly no attacking the infrastructure.\n4. Points awarded based on difficulty of flags.',
        venue: 'IT Block - Room 302',
        date: 'March 26th, 11:00 AM',
        eventType: 'Team',
        maxTeamSize: 2,
        coordinatorName: 'Arjun Das',
        coordinatorPhone: '8877665544'
    }
];

const seedEvents = async () => {
    try {
        await Event.deleteMany({});
        await Event.insertMany(sampleEvents);
        console.log('Sample events seeded successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedEvents();
