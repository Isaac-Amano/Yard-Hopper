const express = require('express');
const app = express();
require('dotenv').config();  // Load environment variables
const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
// const imageRouter = require('./routes/image.router');  // Import the image router
const listingRouter = require('./routes/listing.router');

// Express Middleware
app.use(express.json());  // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // To parse form data
app.use(express.static('build'));  // Serve static files from the 'build' folder

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);  // User routes
// app.use('/api/image', imageRouter);  // Image upload routes
app.use('/api/listings', listingRouter);  // Listing routes


app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

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
