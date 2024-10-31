const express = require('express');
const app = express();
require('dotenv').config();  // Load environment variables
const PORT = process.env.PORT || 5001;  // Use PORT from .env or default to 5001

// Import necessary modules and routers
const imageRouter = require('./routes/image.router');
const userRouter = require('./routes/user.router');
const listingRouter = require('./routes/listing.router');
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Express Middleware
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse form data
app.use(express.static('build'));  // Serve static files from 'build' folder

// Passport Session Configuration
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);  // User routes
app.use('/api/image', imageRouter);  // Image upload routes
app.use('/api/listings', listingRouter);  // Listing routes

// Custom 404 Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// General Error Handling Middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
