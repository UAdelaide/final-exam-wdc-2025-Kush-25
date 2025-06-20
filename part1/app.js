const express = require('express');
const mysql = require('mysql2/promise');
const routes = require('./routes'); // <- rename this if needed

const app = express();
const PORT = 3000;

async function main() {
  try {
    // Connect to MySQL database
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'your_password', // <-- change this
      database: 'DogWalkService'
    });

    app.locals.db = db;

    app.use('/api', routes);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start app:', err);
  }
}

main();


// Testing

await db.execute(`
  INSERT IGNORE INTO Users (username, email, password_hash, role)
  VALUES
    ('alice123', 'alice@example.com', 'hashed123', 'owner'),
    ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
    ('carol123', 'carol@example.com', 'hashed789', 'owner')
`);

await db.execute(`
  INSERT IGNORE INTO Dogs (owner_id, name, size)
  VALUES
    ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
    ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small')
`);

await db.execute(`
  INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
  VALUES
    ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
    ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted')
`);