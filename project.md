# EduVoyage - MERN Blogging Platform

This is a web application where students and alumni can share their college experiences, technology insights, and study tips through blogs.

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/)
- (Optional) Node.js and MongoDB (if running locally without Docker)

---

### 🐳 Running with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anand2025/EduVoyage.git
   cd EduVoyage
   ```

2. **Setup Environment Variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DB_USERNAME=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   ACCESS_SECRET_KEY=your_access_token_secret
   REFRESH_SECRET_KEY=your_refresh_token_secret
   ```

3. **Run the application:**
   ```bash
   docker-compose up --build
   ```

4. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:8000](http://localhost:8000)

---

### 🛠️ Running Locally (Manual)

#### 1. Setup Backend
```bash
# In the root directory
npm install
npm start
```

#### 2. Setup Frontend
```bash
cd client
npm install
npm start
```

---

## 🏗️ Project Structure

- `/client`: React frontend (Material UI, Context API)
- `/controller`: Backend logic for posts, comments, and users
- `/model`: Mongoose schemas
- `/routes`: API endpoint definitions
- `/database`: Connection logic
- `/utils`: Helper functions and file upload logic (GridFS)

## 📄 Documentation

Check [lld.md](./lld.md) for a detailed technical design architecture.
