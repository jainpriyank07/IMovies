# IMovies

IMovies is a movie ticket booking platform built with a Node.js + Express backend and a React frontend. It includes user authentication, movie listing, seat booking, and a clean responsive interface.

## Features
- Browse featured movies
- User registration and login
- Book movie tickets with selected showtime and number of seats
- View booking history
- Responsive UI for desktop and mobile

## Tech Stack
- Frontend: React.js + Vite
- Backend: Node.js + Express.js
- Database: MongoDB-ready with in-memory fallback for local demos
- Auth: JWT

## Local Setup

### 1) Install dependencies
```bash
npm install --prefix backend
npm install --prefix frontend
```

### 2) Start backend
```bash
npm run dev --prefix backend
```

### 3) Start frontend
```bash
npm run dev --prefix frontend
```

### 4) Open the app
Visit:
```bash
http://localhost:5173
```

## Environment
Create a `backend/.env` file using the example file:
```bash
cp backend/.env.example backend/.env
```

## Note
If MongoDB is not running locally, the app will continue using in-memory sample data so the project can still be tested easily.
