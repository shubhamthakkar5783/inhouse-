const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'eventplanner.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✓ Connected to SQLite database at:', dbPath);
  }
});

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) console.error('Error creating users table:', err.message);
        else console.log('✓ Users table ready');
      });

      db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        event_name TEXT NOT NULL,
        event_type TEXT NOT NULL,
        description TEXT,
        date DATE,
        time TIME,
        location TEXT,
        city TEXT,
        venue_type TEXT,
        audience_size INTEGER DEFAULT 0,
        duration INTEGER DEFAULT 4,
        status TEXT DEFAULT 'planning',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`, (err) => {
        if (err) console.error('Error creating events table:', err.message);
        else console.log('✓ Events table ready');
      });

      db.run(`CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        venue_total REAL DEFAULT 0,
        catering_total REAL DEFAULT 0,
        services_total REAL DEFAULT 0,
        miscellaneous_total REAL DEFAULT 0,
        grand_total REAL DEFAULT 0,
        budget_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )`, (err) => {
        if (err) console.error('Error creating budgets table:', err.message);
        else console.log('✓ Budgets table ready');
      });

      db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'todo',
        priority TEXT DEFAULT 'medium',
        assigned_to TEXT,
        due_date DATE,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )`, (err) => {
        if (err) console.error('Error creating tasks table:', err.message);
        else console.log('✓ Tasks table ready');
      });

      db.run(`CREATE TABLE IF NOT EXISTS marketing_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        material_type TEXT NOT NULL,
        title TEXT,
        content TEXT,
        file_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )`, (err) => {
        if (err) console.error('Error creating marketing_materials table:', err.message);
        else console.log('✓ Marketing Materials table ready');
      });

      db.run(`CREATE TABLE IF NOT EXISTS timeline_activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        activity_type TEXT DEFAULT 'general',
        start_time TIME,
        duration INTEGER DEFAULT 60,
        location TEXT,
        attendees INTEGER,
        description TEXT,
        resources TEXT,
        assigned_to TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )`, (err) => {
        if (err) {
          console.error('Error creating timeline_activities table:', err.message);
          reject(err);
        } else {
          console.log('✓ Timeline Activities table ready');
          console.log('\n✓ Database initialization complete!\n');
          resolve();
        }
      });
    });
  });
};

const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  db,
  initializeDatabase,
  runQuery,
  getQuery,
  allQuery
};
