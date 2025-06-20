const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE email = ? AND password_hash = ?
    `, [email, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = {
      user_id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };

    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed due to server error.' });
  }
});

// --- New Logout Route ---
router.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ error: 'Failed to logout.' });
    }

    // Clear the session cookie from the client's browser
    // 'connect.sid' is the default name for express-session's cookie
    // If you configured a different name in app.js, use that name here.
    res.clearCookie('connect.sid');

    res.json({ message: 'Logged out successfully.' });
  });
});
// --- End New Logout Route ---

module.exports = router;
