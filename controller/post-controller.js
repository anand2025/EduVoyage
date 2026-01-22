import Post from '../model/post.js';

//create post
export const createPost = async (request, response) => {
    try {
        if (request.body.picture && request.body.picture.length > 5 * 1024 * 1024) {
            return response.status(413).json({ msg: "Image size is too large. Please upload an image smaller than 5MB." });
        }
        const post = await new Post(request.body);
        await post.save();

        response.status(200).json({ msg: 'Post saved successfully' });
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
}

//update post
export const updatePost = async (request, response) => {
    try {
        if (request.body.picture && request.body.picture.length > 5 * 1024 * 1024) {
            return response.status(413).json({ msg: "Image size is too large. Please upload an image smaller than 5MB." });
        }
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' })
        }
        
        await Post.findByIdAndUpdate( request.params.id, { $set: request.body })

        response.status(200).json('Post updated successfully');
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
}

//Delete Post
export const deletePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        
        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }

        await post.deleteOne();

        response.status(200).json('Post deleted successfully');
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
}

export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }

        response.status(200).json(post);
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
}

export const getAllPosts = async (request, response) => {
    let username = request.query.username;
    let category = request.query.category;
    let tag = request.query.tag;
    let search = request.query.search;
    let posts;
    try {
        if(username) 
            posts = await Post.find({ username: username });
        else if (category) 
            posts = await Post.find({ categories: category });
        else if (tag)
            posts = await Post.find({ tags: tag });
        else if (search) {
            posts = await Post.find({
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { tags: { $regex: search, $options: 'i' } }
                ]
            });
        }
        else 
            posts = await Post.find({});
            
        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json({ msg: error.message });
    }
}

export const likePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) return response.status(404).json({ msg: 'Post not found' });
        
        const username = request.body.username;

        if (post.likes.includes(username)) {
            await Post.findByIdAndUpdate(request.params.id, { $pull: { likes: username } });
            return response.status(200).json({ msg: 'Post unliked successfully', type: 'unlike' });
        } else {
            await Post.findByIdAndUpdate(request.params.id, { 
                $addToSet: { likes: username },
                $pull: { dislikes: username }
            });
            return response.status(200).json({ msg: 'Post liked successfully', type: 'like' });
        }
    } catch (error) {
        return response.status(500).json({ msg: error.message });
    }
}

export const dislikePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) return response.status(404).json({ msg: 'Post not found' });

        const username = request.body.username;

        if (post.dislikes.includes(username)) {
            await Post.findByIdAndUpdate(request.params.id, { $pull: { dislikes: username } });
            return response.status(200).json({ msg: 'Post dislike removed successfully', type: 'undislike' });
        } else {
            await Post.findByIdAndUpdate(request.params.id, { 
                $addToSet: { dislikes: username },
                $pull: { likes: username }
            });
            return response.status(200).json({ msg: 'Post disliked successfully', type: 'dislike' });
        }
    } catch (error) {
        return response.status(500).json({ msg: error.message });
    }
}