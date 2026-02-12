# EduVoyage 

EduVoyage is a comprehensive MERN stack blogging platform designed for students and alumni to share experiences, insights, and study tips.

##  Features

- **Secure Authentication**: JWT-based login and signup with refresh token support.
- **Blog Management**: Full CRUD operations for blog posts with rich metadata (title, category, tags, images).
- **Interactive Comments**: Real-time feedback loop with a robust comment system.
- **Multimedia Support**: Image uploads managed via MongoDB GridFS for efficient storage.
- **Filtering**: Filter blogs by categories, tags, or search by title.
- **User Interactions**: Like/dislike posts and a personalized "Saved Posts" feature.
- **Author Insights**: Detailed statistics for authors to track their post performance.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views using Material UI.
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation.

## Tech Stack

### Frontend
- **React.js**: Progressive UI development.
- **Material UI**: Sleek, modern design components.
- **Axios**: Efficient API communication.

### Backend
- **Node.js & Express.js**: High-performance server-side logic.
- **MongoDB & Mongoose**: Flexible NoSQL data modeling.
- **GridFS**: Managed storage for large media files.
- **JWT**: Robust authentication and authorization.

### Documentation & Tools
- **Swagger UI**: Interactive API testing playground.
- **Morgan & Helmet**: Logging and security middleware.
- **Nodemon**: Seamless development experience.

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anand2025/EduVoyage.git
   cd EduVoyage
   ```

2. **Backend Setup**
   ```bash
   # Install dependencies
   npm install --legacy-peer-deps

   # Create .env file
   # Populate with: DB_USERNAME, DB_PASSWORD, ACCESS_SECRET_KEY, REFRESH_SECRET_KEY
   
   # Start the server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install --legacy-peer-deps
   npm start
   ```

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
`http://localhost:8000/api-docs`

## Demo Screenshots

![Screenshot 1](https://github.com/anand2025/EduVoyage/assets/105790879/a4e42b89-2267-400c-989d-5da0c6ba02fa)<br />
![Screenshot 2](https://github.com/anand2025/EduVoyage/assets/105790879/6e91ee6e-7299-4a59-bc8f-ea4d6a9f919e)<br />
![Screenshot 3](https://github.com/anand2025/EduVoyage/assets/105790879/5946a26a-f860-4b82-ac99-1ca46a8b9443)<br />
![Screenshot 4](https://github.com/anand2025/EduVoyage/assets/105790879/e381b540-a65d-42aa-9540-3b742f579b94)<br />
![Screenshot 5](https://github.com/anand2025/EduVoyage/assets/105790879/45a973a2-0a63-4a5e-b755-86ac232a3c2a)<br />
![Screenshot 6](https://github.com/anand2025/EduVoyage/assets/105790879/0d869555-b579-450b-89d0-1abc78379cd0)<br />
![Screenshot 7](https://github.com/anand2025/EduVoyage/assets/105790879/15aa913f-ff48-4909-88a2-6219f1e5176b)<br />
![Screenshot 8](https://github.com/anand2025/EduVoyage/assets/105790879/b659ade7-d17d-4538-84b8-f61d38e83edd)<br />


