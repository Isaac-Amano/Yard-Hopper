const express = require('express');
const app = express();
require('dotenv').config();  // Load environment variables
const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
const imageRouter = require('./routes/image.router'); // Import the image router
const listingRouter = require('./routes/listing.router');


// Express Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/listings', listingRouter);

// Routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter); // not sure

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
