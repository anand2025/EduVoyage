import express from 'express';

import { createPost, updatePost, deletePost, getPost, getAllPosts, likePost, dislikePost } from '../controller/post-controller.js';
import { uploadImage, getImage } from '../controller/image-controller.js';
import { newComment, getComments, deleteComment } from '../controller/comment-controller.js';
import { loginUser, signupUser, logoutUser, toggleSavePost, getSavedPosts, getUserDetails, updateUserProfile } from '../controller/user-controller.js';
import { authenticateToken, createNewToken } from '../controller/jwt-controller.js';


const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/logout', logoutUser);

router.post('/token', createNewToken);

router.post('/create', authenticateToken, createPost);
router.put('/update/:id', authenticateToken, updatePost);
router.delete('/delete/:id', authenticateToken, deletePost);

router.get('/post/:id', authenticateToken, getPost);
router.get('/posts', authenticateToken, getAllPosts);
router.post('/like/:id', authenticateToken, likePost);
router.post('/dislike/:id', authenticateToken, dislikePost);
router.post('/save', authenticateToken, toggleSavePost);
router.get('/savedPosts/:username', authenticateToken, getSavedPosts);
router.get('/user/:username', authenticateToken, getUserDetails);
router.put('/user/update', authenticateToken, updateUserProfile);

router.post('/file/upload', uploadImage);
router.get('/file/:filename', getImage);

router.post('/comment/new', authenticateToken, newComment);
router.get('/comments/:id', authenticateToken, getComments);
router.delete('/comment/delete/:id', authenticateToken, deleteComment);

export default router;