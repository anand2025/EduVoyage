import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    savedPosts: {
        type: Array, // Array of post IDs
        default: []
    },
    bio: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    onboardingCompleted: {
        type: Boolean,
        default: false
    },
    interests: {
        type: [String],
        default: []
    },
    readingGoal: {
        type: String,
        default: ''
    }
});


const user = mongoose.model('user', userSchema);

export default user;