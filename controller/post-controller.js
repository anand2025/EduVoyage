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
    
    // Pagination parameters
    let page = parseInt(request.query.page) || 1;
    let limit = parseInt(request.query.limit) || 9;
    let skip = (page - 1) * limit;

    // Debug logging for filtering issue
    console.log('getAllPosts called with query:', request.query);
    console.log('username:', username, 'category:', category, 'search:', search, 'page:', page, 'limit:', limit);

    let posts;
    let totalPosts = 0;
    try {
        let query = {};
        if (username) query.username = username;
        if (category && category !== 'All') query.categories = category;
        if (tag) query.tags = tag;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        totalPosts = await Post.countDocuments(query);
        posts = await Post.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: -1 }); // Show latest posts first
            
        response.status(200).json({ posts, totalPosts, totalPages: Math.ceil(totalPosts / limit), currentPage: page });
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