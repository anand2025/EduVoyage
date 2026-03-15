import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../model/token.js'
import User from '../model/user.js';
import Post from '../model/post.js';
import Comment from '../model/comment.js';

dotenv.config();

export const signupUser = async (request, response) => {
    try {
        const { username, name, password } = request.body;

        if (!username || !name || !password) {
            return response.status(400).json({ msg: 'All fields (name, username, password) are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return response.status(400).json({ msg: 'Username already exists. Please choose another.' });
        }

        // Backend validation: Minimum 8 characters, at least one letter, one number and one special character
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return response.status(400).json({ msg: 'Password must be at least 8 characters long and include at least one letter, one number, and one special character.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = { username, name, password: hashedPassword }

        const newUser = new User(user);
        await newUser.save();

        return response.status(200).json({ msg: 'Signup successfull' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while signing up user' });
    }
}


export const loginUser = async (request, response) => {
    try {
        const { username, password } = request.body;

        if (!username || !password) {
            return response.status(400).json({ msg: 'Username and password are required.' });
        }

        let user = await User.findOne({ username });
        if (!user) {
            return response.status(400).json({ msg: 'Username does not match' });
        }

        let match = await bcrypt.compare(password, user.password);
        if (match) {
            const payload = { 
                username: user.username, 
                name: user.name, 
                _id: user._id,
                isPremium: user.isPremium
            };
            const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '60m'});
            const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY);
            
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        
            return response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, name: user.name, username: user.username, isPremium: user.isPremium, onboardingCompleted: user.onboardingCompleted });
        
        } else {
            return response.status(400).json({ msg: 'Password does not match' })
        }
    } catch (error) {
        return response.status(500).json({ msg: 'Error while login the user' })
    }
}

export const logoutUser = async (request, response) => {
    try {
        const token = request.body.token;
        if (!token) {
            return response.status(400).json({ msg: 'Token is required' });
        }
        await Token.deleteOne({ token: token });
        return response.status(204).json({ msg: 'Logout successful' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while logout' });
    }
}

export const toggleSavePost = async (request, response) => {
    try {
        const { postId } = request.body;
        const username = request.user.username;
        
        let user = await User.findOne({ username });
        if (!user) {
            return response.status(404).json({ msg: 'User not found' });
        }

        if (user.savedPosts.includes(postId)) {
            await User.findOneAndUpdate({ username }, { $pull: { savedPosts: postId } });
            return response.status(200).json({ msg: 'Post unsaved successfully', type: 'unsave' });
        } else {
            await User.findOneAndUpdate({ username }, { $addToSet: { savedPosts: postId } });
            return response.status(200).json({ msg: 'Post saved successfully', type: 'save' });
        }
    } catch (error) {
        return response.status(500).json({ msg: 'Error while saving post', error: error.message });
    }
}

export const getSavedPosts = async (request, response) => {
    try {
        const username = request.params.username;

        if (username !== request.user.username) {
             return response.status(403).json({ msg: 'Forbidden: You can only view your own saved posts' });
        }

        const user = await User.findOne({ username: username });
        if (!user) {
            return response.status(404).json({ msg: 'User not found' });
        }

        return response.status(200).json(user.savedPosts);
    } catch (error) {
        return response.status(500).json({ msg: 'Error while fetching saved posts', error: error.message });
    }
}

export const getUserDetails = async (request, response) => {
    try {
        const user = await User.findOne({ username: request.params.username });
        if (!user) {
            return response.status(404).json({ msg: 'User not found' });
        }

        // Exclude password and savedPosts for privacy/security
        const { password, savedPosts, ...publicInfo } = user._doc;
        return response.status(200).json(publicInfo);
    } catch (error) {
        return response.status(500).json({ msg: 'Error while fetching user details', error: error.message });
    }
}

export const updateUserProfile = async (request, response) => {
    try {
        const { name, bio, profilePicture } = request.body;
        const username = request.user.username;
        
        // Check image size (Base64 string size check)
        if (profilePicture && profilePicture.length > 5 * 1024 * 1024) {
            return response.status(413).json({ msg: "Image size is too large. Please upload an image smaller than 5MB." });
        }
        let user = await User.findOneAndUpdate(
            { username: username }, 
            { $set: { name, bio, profilePicture } },
            { new: true }
        );

        if (!user) {
            return response.status(404).json({ msg: 'User not found' });
        }

        const { password, ...updatedInfo } = user._doc;
        return response.status(200).json({ msg: 'Profile updated successfully', user: updatedInfo });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while updating profile', error: error.message });
    }
}

export const getAuthorStats = async (request, response) => {
    try {
        const username = request.params.username;
        console.log('Fetching stats for author:', username);

        if (username !== request.user.username) {
            console.log('Stats access denied. Requesting user:', request.user.username, 'Target author:', username);
            return response.status(403).json({ msg: 'Forbidden: You can only view your own statistics' });
        }

        const posts = await Post.find({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        console.log(`Found ${posts.length} posts for author: ${username}`);
        
        const totalPosts = posts.length;

        let totalLikes = 0;
        let totalDislikes = 0;
        const categoryStats = {};

        const postIds = [];
        posts.forEach(post => {
            totalLikes += (post.likes ? post.likes.length : 0);
            totalDislikes += (post.dislikes ? post.dislikes.length : 0);
            postIds.push(post._id.toString());

            if (post.categories) {
                const categories = Array.isArray(post.categories) ? post.categories : [post.categories];
                categories.forEach(cat => {
                    categoryStats[cat] = (categoryStats[cat] || 0) + 1;
                });
            }
        });

        const totalComments = await Comment.countDocuments({ postId: { $in: postIds } });
        console.log('Stats aggregated:', { totalPosts, totalLikes, totalDislikes, totalComments, categoryStats });

        return response.status(200).json({
            totalPosts,
            totalLikes,
            totalDislikes,
            totalComments,
            categoryStats
        });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while fetching author stats', error: error.message });
    }
}

export const saveOnboarding = async (request, response) => {
    try {
        const username = request.user.username;
        const { interests, readingGoal } = request.body;

        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: { interests: interests || [], readingGoal: readingGoal || '', onboardingCompleted: true } },
            { new: true }
        );

        if (!updatedUser) {
            return response.status(404).json({ msg: 'User not found' });
        }

        return response.status(200).json({ msg: 'Onboarding saved successfully' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while saving onboarding data', error: error.message });
    }
}

export const subscribeUser = async (request, response) => {
    try {
        const username = request.user.username;
        const user = await User.findOneAndUpdate(
            { username },
            { $set: { isPremium: true } },
            { new: true }
        );

        if (!user) {
            return response.status(404).json({ msg: 'User not found' });
        }

        const payload = { 
            username: user.username, 
            name: user.name, 
            _id: user._id,
            isPremium: user.isPremium
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '60m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY);
        
        const newToken = new Token({ token: refreshToken });
        await newToken.save();

        return response.status(200).json({ msg: 'Successfully subscribed to Premium', user, accessToken, refreshToken });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while subscribing', error: error.message });
    }
}
