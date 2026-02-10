# Technical Documentation: EduVoyage Frontend

This document outlines the technical architecture, state management, and integration patterns used in the EduVoyage React frontend.

## Technical Stack

- **Framework**: React.js (v18.2.0)
- **Styling**: Material UI (MUI) v5.15
- **Routing**: React Router DOM v6.22
- **API Client**: Axios v1.6.8

## Project Structure

```text
client/src/
├── components/         # Feature-based UI components
│   ├── account/        # Login/Signup logic
│   ├── home/           # Dashboard and post lists
│   ├── details/        # Single post view
│   ├── create/         # Post creation and editing
│   └── header/         # Global navigation
├── context/            # React Context providers for state
├── service/            # Centralized API service layer
├── constants/          # API URLs and notification strings
├── utils/              # Helper functions (JWT, type checking)
└── App.js              # Root component & Routing
```

## Authentication & Routing

EduVoyage uses a robust routing system with protected routes:

### PrivateRoute Component
The `PrivateRoute` component wraps authenticated routes. It checks for a valid `accessToken` in `sessionStorage`. If the user is unauthenticated, they are redirected to the `/account` (login) page.

### Token Management
- **Access Token**: Stored in `sessionStorage` and sent in the `Authorization` header for every request.
- **State Persistence**: The authentication state is synchronized with `sessionStorage` to maintain the user's session across page refreshes.

## State Management (Context API)

The application uses the **React Context API** for global state management, primarily focusing on user account information.

### DataProvider
The `DataProvider` component in `context/DataProvider.jsx` wraps the entire application. It provides:
- `account`: An object containing the current user's `name` and `username`.
- `setAccount`: A function to update the global user state.

This eliminates "prop-drilling" and allows any component to access user details via the `useContext` hook.

## API Service Layer (`api.js`)

API communication is centralized in `client/src/service/api.js`. This module provides a standardized way to interact with the backend.

### Standardized Requests
Instead of manual `axios` calls in components, the `API` object is used. It is dynamically populated from `SERVICE_URLS` in `constants/config.js`.

### Interceptors
- **Request Interceptor**: Automatically handles dynamic URL parameters and query strings.
- **Response Interceptor**: Standardizes the response format.
  - Success: `{ isSuccess: true, data: [...] }`
  - Failure: `{ isError: true, msg: "...", code: 404 }`

### Error Handling
A centralized `ProcessError` function handles various HTTP status codes (401, 403, 413, 500) and provides user-friendly error messages.

## Styling & Design
- **Material UI**: Components like `Box`, `Grid`, and `Typography` are used to ensure a consistent, responsive grid system.
- **Custom CSS**: Minimal custom CSS in `App.css` and `index.css` for global overrides and specific micro-animations.
- **Responsive Design**: Mobile-first approach using MUI's breakpoint system.
