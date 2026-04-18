require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

async function setup() {
  let connection;

  try {
    const dbName = process.env.DB_NAME || 'school_management';

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
    });

    console.log(`Connected to database "${dbName}"`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id        INT          NOT NULL AUTO_INCREMENT,
        name      VARCHAR(255) NOT NULL,
        address   VARCHAR(500) NOT NULL,
        latitude  FLOAT        NOT NULL,
        longitude FLOAT        NOT NULL,
        PRIMARY KEY (id)
      )
    `);
    console.log('Table "schools" created or already exists');

    const [rows] = await connection.query('SELECT COUNT(*) AS cnt FROM schools');
    if (rows[0].cnt === 0) {
      await connection.query(`
        INSERT INTO schools (name, address, latitude, longitude) VALUES
          ('Delhi Public School', 'Mathura Road, New Delhi, Delhi 110003', 28.5450, 77.2590),
          ('The Doon School', 'Mall Road, Dehradun, Uttarakhand 248001', 30.3204, 78.0297),
          ('Bishop Cotton School', 'Circular Road, Shimla, Himachal Pradesh 171001', 31.1048, 77.1734),
          ('La Martiniere College', 'La Martiniere Road, Lucknow, Uttar Pradesh 226001', 26.8509, 80.9462),
          ('Cathedral and John Connon School', 'Fort, Mumbai, Maharashtra 400001', 18.9330, 72.8353)
      `);
      console.log('Sample schools inserted');
    } else {
      console.log('Schools table already has data, skipping insert');
    }

    console.log('Database setup complete. You can now start the server.');
  } catch (err) {
    console.error('Database setup failed:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setup();
