const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session'); // <-- ADD THIS LINE

const app = express();

// <-- ADD THIS BLOCK START -->
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_default_secret_please_change_this_in_env', // IMPORTANT: CHANGE THIS IN YOUR .ENV
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Session lasts 24 hours
}));
// <-- ADD THIS BLOCK END -->

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;