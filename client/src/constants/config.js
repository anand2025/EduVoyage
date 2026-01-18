//notifications that are displayed outside the page at the system level
export const API_NOTIFICATION_MESSAGES = {
    loading: {
        title: "Loading...",
        message: "Please wait"
    },
    success: {
        title: "Success",
        message: "Data successfully loaded"
    },
    requestFailure: {
        title: "Error!",
        message: "An error occur while parsing request data"
    },
    responseFailure: {
        title: "Error!",
        message: "An error occur while fetching response from server. Please try again"
    },
    networkError: {
        title: "Error!",
        message: "Unable to connect to the server. Please check your internet connection and try again."
    }
}

// API SERVICE URL
// SAMPLE REQUEST
// NEED SERVICE CALL: { url: '/', method: "POST/GET/PUT/DELETE" }
//DELETE is used to delete the specified resource.
//PUT is used to send data to a server to replace/update a resource.
//POST is used to send data to a server to create a resource.
//GET is used to request data from a specified resource.
export const SERVICE_URLS = {
    userLogin: { url: '/login', method: 'POST' },
    userSignup: { url: '/signup', method: 'POST' },
    getAllPosts: { url: '/posts', method: 'GET', params: true },
    getRefreshToken: { url: '/token', method: 'POST' },
    uploadFile: { url: 'file/upload', method: 'POST' },
    createPost: { url: 'create', method: 'POST' },
    deletePost: { url: 'delete', method: 'DELETE', query: true },
    getPostById: { url: 'post', method: 'GET', query: true },
    newComment: { url: '/comment/new', method: 'POST' },
    getAllComments: { url: 'comments', method: 'GET', query: true },
    deleteComment: { url: 'comment/delete', method: 'DELETE', query: true },
    updatePost: { url: 'update', method: 'PUT', query: true },
    likePost: { url: 'like', method: 'POST', query: true },
    dislikePost: { url: 'dislike', method: 'POST', query: true },
    savePost: { url: 'save', method: 'POST' },
    getSavedPosts: { url: 'savedPosts', method: 'GET', query: true }
}