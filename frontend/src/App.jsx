import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('imovies-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('imovies-token') || '');
  const [bookings, setBookings] = useState([]);
  const [bookingForm, setBookingForm] = useState({ showtime: '18:30', seats: '2' });

  const fetchMovies = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/movies`);
      setMovies(data);
      if (!selectedMovie && data[0]) {
        setSelectedMovie(data[0]);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (user && token) {
      loadBookings();
    }
  }, [user, token]);

  const loadBookings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    try {
      const endpoint = authMode === 'login' ? 'auth/login' : 'auth/register';
      const payload = authMode === 'login'
        ? { email: form.email, password: form.password }
        : form;

      const { data } = await axios.post(`${API_URL}/${endpoint}`, payload);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('imovies-user', JSON.stringify(data.user));
      localStorage.setItem('imovies-token', data.token);
      setForm({ name: '', email: '', password: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed.');
    }
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    if (!selectedMovie) {
      return;
    }

    if (!user || !token) {
      alert('Please log in before booking a ticket.');
      return;
    }

    try {
      const seats = Number(bookingForm.seats);
      const totalPrice = selectedMovie.price * seats;

      const { data } = await axios.post(
        `${API_URL}/bookings`,
        {
          movieId: selectedMovie.id,
          showtime: bookingForm.showtime,
          seats,
          totalPrice
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(data.message);
      setBookingForm({ showtime: '18:30', seats: '2' });
      fetchMovies();
      loadBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('imovies-user');
    localStorage.removeItem('imovies-token');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand">IMovies</p>
          <span>Movie ticket booking made simple</span>
        </div>

        {user ? (
          <div className="user-box">
            <span>Welcome, {user.name}</span>
            <button className="secondary-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-toggle">
            <button
              className={authMode === 'login' ? 'active' : ''}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              className={authMode === 'register' ? 'active' : ''}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>
        )}
      </header>

      <main className="main-layout">
        <section className="movies-panel">
          <h2>Now Showing</h2>
          <div className="movie-grid">
            {movies.map((movie) => (
              <button
                key={movie.id}
                className={`movie-card ${selectedMovie?.id === movie.id ? 'selected' : ''}`}
                onClick={() => setSelectedMovie(movie)}
              >
                <img src={movie.poster} alt={movie.title} />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre} • {movie.duration}</p>
                  <div className="meta-row">
                    <span>⭐ {movie.rating}</span>
                    <strong>₹{movie.price}</strong>
                  </div>
                  <div className="availability-tag">{movie.availableSeats} seats left</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="sidebar">
          {selectedMovie && (
            <div className="booking-card">
              <img src={selectedMovie.poster} alt={selectedMovie.title} className="hero-poster" />
              <h3>{selectedMovie.title}</h3>
              <p>{selectedMovie.description}</p>
              <div className="booking-meta">
                <span>{selectedMovie.genre}</span>
                <span>{selectedMovie.duration}</span>
                <span>⭐ {selectedMovie.rating}</span>
              </div>
              <div className="availability-badge">Real-time availability: {selectedMovie.availableSeats} seats left</div>

              <form onSubmit={handleBookingSubmit} className="booking-form">
                <label>
                  Showtime
                  <select
                    value={bookingForm.showtime}
                    onChange={(e) => setBookingForm({ ...bookingForm, showtime: e.target.value })}
                  >
                    <option value="18:30">18:30</option>
                    <option value="19:45">19:45</option>
                    <option value="21:15">21:15</option>
                  </select>
                </label>

                <label>
                  Seats
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={bookingForm.seats}
                    onChange={(e) => setBookingForm({ ...bookingForm, seats: e.target.value })}
                  />
                </label>

                <div className="summary-box">
                  <span>Total</span>
                  <strong>₹{selectedMovie.price * Number(bookingForm.seats || 1)}</strong>
                </div>

                <button type="submit" className="primary-btn">Book Now</button>
              </form>
            </div>
          )}

          {!user && (
            <form className="auth-card" onSubmit={handleAuthSubmit}>
              <h3>{authMode === 'login' ? 'Login to continue' : 'Create your account'}</h3>

              {authMode === 'register' && (
                <label>
                  Name
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </label>
              )}

              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </label>

              <button type="submit" className="primary-btn">
                {authMode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>
          )}

          {user && bookings.length > 0 && (
            <div className="booking-history">
              <h3>Your Bookings</h3>
              {bookings.map((booking) => (
                <div key={booking.id} className="history-item">
                  <strong>{booking.movieTitle}</strong>
                  <span>{booking.showtime} • {booking.seats} seats</span>
                  <small>₹{booking.totalPrice}</small>
                </div>
              ))}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
