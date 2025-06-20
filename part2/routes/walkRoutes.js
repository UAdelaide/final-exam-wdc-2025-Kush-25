const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all walk requests (for walkers to view)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT wr.*, d.name AS dog_name, d.size, u.username AS owner_name
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch walk requests' });
  }
});

// POST a new walk request (from owner)
router.post('/', async (req, res) => {
  const { dog_id, requested_time, duration_minutes, location } = req.body;

  try {
    // Optional: Add a check here to ensure the dog_id belongs to the logged-in owner
    // if (!req.session.user || req.session.user.role !== 'owner') {
    //   return res.status(403).json({ error: 'Unauthorized' });
    // }
    // const [dogCheck] = await db.query('SELECT owner_id FROM Dogs WHERE dog_id = ?', [dog_id]);
    // if (dogCheck.length === 0 || dogCheck[0].owner_id !== req.session.user.user_id) {
    //   return res.status(403).json({ error: 'Dog does not belong to this owner.' });
    // }

    const [result] = await db.query(`
      INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location)
      VALUES (?, ?, ?, ?)
    `, [dog_id, requested_time, duration_minutes, location]);

    res.status(201).json({ message: 'Walk request created', request_id: result.insertId });
  } catch (error) {
    console.error('Error creating walk request:', error); // Added more specific logging
    res.status(500).json({ error: 'Failed to create walk request' });
  }
});

// POST an application to walk a dog (from walker)
router.post('/:id/apply', async (req, res) => {
  const requestId = req.params.id;
  const { walker_id } = req.body; // In a real app, walker_id would come from session

  try {
    // Check if the walker_id is actually the logged-in walker (important security check)
    // if (!req.session.user || req.session.user.role !== 'walker' || req.session.user.user_id !== walker_id) {
    //   return res.status(403).json({ error: 'Unauthorized application' });
    // }

    await db.query(`
      INSERT INTO WalkApplications (request_id, walker_id)
      VALUES (?, ?)
    `, [requestId, walker_id]);

    await db.query(`
      UPDATE WalkRequests
      SET status = 'accepted'
      WHERE request_id = ?
    `, [requestId]);

    res.status(201).json({ message: 'Application submitted' });
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to apply for walk' });
  }
});

// Get Dogs by Owner ID
router.get('/owner-dogs/:ownerId', async (req, res) => {
  const ownerId = req.params.ownerId;

    // Only owner can find their dog
  if (!req.session.user || req.session.user.user_id != ownerId || req.session.user.role !== 'owner') {
    return res.status(403).json({ error: 'Unauthorized to view these dogs.' });
  }

  try {
    const [rows] = await db.query(
      `SELECT dog_id, name FROM Dogs WHERE owner_id = ? ORDER BY name ASC`,
      [ownerId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching owner dogs:', error);
    res.status(500).json({ error: 'Failed to fetch dogs for owner.' });
  }
});
// END NEW ROUTE

module.exports = router;
