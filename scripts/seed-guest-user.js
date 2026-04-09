/**
 * Seed script: Creates the guest_user account in MongoDB.
 * Run once with: node scripts/seed-guest-user.js
 * 
 * Guest credentials:
 *   Username: guest_user
 *   Password: Guest@123
 */

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    savedPosts: { type: Array, default: [] },
    bio: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    createdDate: { type: Date, default: Date.now },
    isPremium: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false },
    interests: { type: [String], default: [] },
    readingGoal: { type: String, default: '' }
});

const User = mongoose.model('user', userSchema);

const MONGODB_URI = process.env.MONGODB_URI || `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sghs2mc.mongodb.net/?appName=Cluster0`;

async function seedGuestUser() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
        console.log('✅ Connected to MongoDB');

        const existing = await User.findOne({ username: 'guest_user' });
        if (existing) {
            console.log('ℹ️  Guest user already exists. No changes made.');
            await mongoose.disconnect();
            return;
        }

        const hashedPassword = await bcrypt.hash('Guest@123', 10);
        const guestUser = new User({
            name: 'Guest User',
            username: 'guest_user',
            password: hashedPassword,
            bio: 'This is a read-only demo account for interviewers and testers.',
            onboardingCompleted: true,
            interests: ['Technology', 'Science', 'Education'],
            readingGoal: 'casual',
            isPremium: false,
        });

        await guestUser.save();
        console.log('🎉 Guest user created successfully!');
        console.log('   Username: guest_user');
        console.log('   Password: Guest@123');
    } catch (error) {
        console.error('❌ Error seeding guest user:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seedGuestUser();
