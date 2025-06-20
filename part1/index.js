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

    // Make DB accessible inside routes via req.app.locals.db
    app.locals.db = db;

    // Mount routes at /api
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
