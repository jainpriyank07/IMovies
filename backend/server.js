const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'imovies-secret';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const movies = [
  {
    id: 1,
    title: 'Dune: Part Two',
    genre: 'Sci-Fi',
    rating: 8.7,
    duration: '2h 46m',
    price: 320,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=80',
    description: 'A monumental sci-fi epic spanning power, prophecy, and survival.'
  },
  {
    id: 2,
    title: 'Inside Out 2',
    genre: 'Animation',
    rating: 8.2,
    duration: '1h 36m',
    price: 280,
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    description: 'A new emotional adventure as Riley faces the chaos of growing up.'
  },
  {
    id: 3,
    title: 'The Batman',
    genre: 'Action',
    rating: 8.9,
    duration: '2h 56m',
    price: 350,
    poster: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80',
    description: 'Dark, tactical, and suspenseful as Gotham hunts its haunted hero.'
  },
  {
    id: 4,
    title: 'Oppenheimer',
    genre: 'Drama',
    rating: 9.1,
    duration: '3h 0m',
    price: 390,
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    description: 'An intense story of genius, pressure, and the cost of innovation.'
  }
];

const users = [];
const bookings = [];

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('MongoDB unavailable, continuing with in-memory app storage');
  }
}

connectMongo();

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'IMovies API is running.' });
});

app.get('/api/movies', (req, res) => {
  res.json(movies);
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === String(email).toLowerCase()
  );

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now(),
    name,
    email,
    passwordHash
  };

  users.push(user);

  res.status(201).json({
    message: 'Registration successful.',
    token: createToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = users.find(
    (item) => item.email.toLowerCase() === String(email).toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  res.json({
    message: 'Login successful.',
    token: createToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

app.get('/api/bookings', authenticate, (req, res) => {
  const userBookings = bookings.filter((booking) => booking.userId === req.user.id);
  res.json(userBookings);
});

app.post('/api/bookings', authenticate, (req, res) => {
  const { movieId, showtime, seats, totalPrice } = req.body;

  if (!movieId || !showtime || !seats) {
    return res.status(400).json({ message: 'Please complete booking details.' });
  }

  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found.' });
  }

  const booking = {
    id: Date.now(),
    userId: req.user.id,
    movieId: Number(movieId),
    movieTitle: movie.title,
    showtime,
    seats: Number(seats),
    totalPrice: Number(totalPrice || movie.price * Number(seats)),
    bookedAt: new Date().toISOString()
  };

  bookings.push(booking);

  res.status(201).json({
    message: 'Booking confirmed successfully.',
    booking
  });
});

app.listen(PORT, () => {
  console.log(`IMovies server running on http://localhost:${PORT}`);
});
