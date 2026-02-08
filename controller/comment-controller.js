import Comment from '../model/comment.js';

//add comments
export const newComment = async (request, response) => {
    try {
        const comment = await new Comment({
            ...request.body,
            name: request.user.username // Force author to be the authenticated user
        });
        await comment.save();

        response.status(200).json('Comment saved successfully');
    } catch (error) {
        response.status(500).json(error);
    }
}

//display comments
export const getComments = async (request, response) => {
    try {
        const comments = await Comment.find({ postId: request.params.id });
        
        response.status(200).json(comments);
    } catch (error) {
        response.status(500).json(error)
    }
}

//Delete comments
export const deleteComment = async (request, response) => {
    try {
        const comment = await Comment.findById(request.params.id);
        
        if (!comment) {
            return response.status(404).json({ msg: 'Comment not found' });
        }

        if (comment.name !== request.user.username) {
            return response.status(403).json({ msg: 'Forbidden: You do not own this comment' });
        }

        await comment.deleteOne()

        response.status(200).json('Comment deleted successfully');
    } catch (error) {
        response.status(500).json(error)
    }
}