# IMovies

IMovies - Movie ticket booking made simple.

## Overview
IMovies is a seamless online platform designed to enhance the cinema experience by allowing users to browse movies, choose showtimes, and reserve seats with real-time availability tracking. Built with Express.js and MongoDB, the application follows a robust client-server architecture for efficient data flow, secure authentication, and smooth ticket booking.

The platform enables users to view movie details, book tickets, manage bookings, and enjoy a personalized cinema experience from a responsive web interface.

## Key Features
- User registration and login with JWT authentication
- Browse list of movies with title, genre, rating, duration, and price
- Select movie, showtime, and seat count
- Real-time seat availability tracking
- Booking confirmation and booking history
- Responsive frontend built with React
- Node.js + Express backend for API services

## Tech Stack
- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Token)
- Styling: CSS
- Tools: Vite, Postman, VS Code

## System Requirements

### Software Requirements
- Operating System: Windows 10/11, macOS, or Linux
- Node.js v16 or above
- npm v8 or above
- React.js
- Express.js
- MongoDB
- Browser: Google Chrome or Firefox
- Postman
- Visual Studio Code

### Hardware Requirements
- Processor: Intel Core i5 / AMD Ryzen 5 or better
- RAM: Minimum 8 GB (16 GB recommended)
- Storage: At least 1 GB free space
- Display: 1366x768 or higher

## Project Architecture
IMovies follows a simple three-layer architecture:
- Frontend Layer: React.js interface for movie browsing and booking
- Backend Layer: Express.js APIs for authentication and booking logic
- Data Layer: MongoDB for persistent storage, with in-memory support available for local testing

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/jainpriyank07/IMovies.git
cd IMovies
```

### 2. Install dependencies
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Configure environment
Create a backend `.env` file:
```bash
cp backend/.env.example backend/.env
```

### 4. Start the backend
```bash
npm run dev --prefix backend
```

### 5. Start the frontend
```bash
npm run dev --prefix frontend
```

### 6. Open the app
Visit:
```bash
http://localhost:5173
```

## Functional Flow
1. User registers or logs in
2. User views movie catalog
3. User selects a movie and showtime
4. User enters number of seats
5. Booking is confirmed and saved
6. Booking history is displayed for the logged-in user

## Notes
This project is structured to work with MongoDB in a live environment and includes an in-memory fallback so the application remains usable even when MongoDB is not running locally.
