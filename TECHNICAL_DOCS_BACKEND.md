# Technical Documentation: EduVoyage Architecture

This document provides in-depth technical details about the EduVoyage backend architecture, data models, and system flows.

## System Architecture

EduVoyage follows a modular MVC (Model-View-Controller) pattern on the backend, ensuring a clean separation of concerns.

### Project Structure
```text
├── client/             # Frontend React application
├── controller/         # Business logic for all API endpoints
├── database/           # Connection logic (MongoDB)
├── model/              # Mongoose data schemas
├── routes/             # API route definitions
├── swagger.js          # Swagger/OpenAPI configuration
└── index.js            # Express server entry point
```

## Data Models (Mongoose)

### User Model
- `name`: Full name of the user.
- `username`: Unique identifier for login.
- `password`: Hashed using `bcrypt`.
- `savedPosts`: Array of `Post` IDs.
- `profileImage`: Reference to GridFS file.

### Post Model
- `title`: Post title.
- `description`: Post body.
- `picture`: Reference to image stored in GridFS.
- `username`: Author's username.
- `categories`: Category names.
- `tags`: Searchable tags.
- `likes/dislikes`: Arrays of usernames.
- `createdDate`: Timestamp.

### Comment Model
- `name`: Commenter's name.
- `postId`: Reference to the blog post.
- `comments`: Comment content.
- `date`: Timestamp.

## Authentication Flow

EduVoyage implements a secure JWT-based authentication system with dual tokens:

1. **Access Token**: Short-lived (typically 15-60m) token for authorized requests.
2. **Refresh Token**: Long-lived token stored in the database to issue new access tokens without requiring user login.

### Flow:
- **Login**: Server validates credentials -> Issues Access & Refresh tokens -> Refresh token saved in MongoDB.
- **Authorized Request**: Frontend sends Access Token in `Authorization: Bearer <token>` header.
- **Token Refresh**: When Access Token expires, frontend calls `/token` with the Refresh Token to get a new Access Token.

## File Storage (GridFS)

Instead of storing images directly in the file system or as base64 in the database, EduVoyage uses **MongoDB GridFS**.
- **Chunks**: Large files are split into chunks.
- **Metadata**: Stored in a separate collection.
- **Benefits**: Scalability, database-native backups, and no limit on file size (standard MongoDB documents are limited to 16MB).

## Security Measures
- **Bcrypt**: For robust password hashing.
- **Helmet**: Secures the app by setting various HTTP headers.
- **CORS**: Restricted cross-origin resource sharing.
- **Dotenv**: Environmental variable isolation for sensitive keys.

## API Endpoints
Comprehensive documentation of all endpoints is available via Swagger at the `/api-docs` path of the running server.
