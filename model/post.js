import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: false   
    },
    createdDate: {
        type: Date
    },
    likes: {
        type: Array, // Array of usernames
        default: []
    },
    dislikes: {
        type: Array, // Array of usernames
        default: []
    },
    tags: {
        type: Array,
        default: []
    }
});


const post = mongoose.model('post', PostSchema);

export default post;