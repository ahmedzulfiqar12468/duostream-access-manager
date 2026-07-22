const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

let db;
const dbPath = path.join(app.getPath('userData'), 'relay-pc.db');

const initialize = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        createTables()
          .then(() => resolve())
          .catch(reject);
      }
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Host PC configuration
      db.run(`
        CREATE TABLE IF NOT EXISTS host_config (
          id INTEGER PRIMARY KEY,
          host_ip TEXT UNIQUE NOT NULL,
          host_port INTEGER DEFAULT 3001,
          relay_name TEXT,
          connected BOOLEAN DEFAULT 0,
          last_connected DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Client accounts
      db.run(`
        CREATE TABLE IF NOT EXISTS clients (
          id INTEGER PRIMARY KEY,
          account_name TEXT NOT NULL,
          user_token TEXT UNIQUE NOT NULL,
          status TEXT DEFAULT 'pending',
          approval_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Time limits per client
      db.run(`
        CREATE TABLE IF NOT EXISTS time_limits (
          id INTEGER PRIMARY KEY,
          client_id INTEGER NOT NULL,
          daily_limit INTEGER DEFAULT 480,
          weekly_limit INTEGER DEFAULT 2400,
          monthly_limit INTEGER DEFAULT 10080,
          daily_used INTEGER DEFAULT 0,
          weekly_used INTEGER DEFAULT 0,
          monthly_used INTEGER DEFAULT 0,
          last_reset_daily DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_reset_weekly DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_reset_monthly DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (client_id) REFERENCES clients(id)
        )
      `);

      // Connection schedules
      db.run(`
        CREATE TABLE IF NOT EXISTS schedules (
          id INTEGER PRIMARY KEY,
          client_id INTEGER NOT NULL,
          day_of_week INTEGER,
          start_time TEXT,
          end_time TEXT,
          FOREIGN KEY (client_id) REFERENCES clients(id)
        )
      `);

      // Active sessions
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY,
          client_id INTEGER NOT NULL,
          session_token TEXT UNIQUE NOT NULL,
          start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          end_time DATETIME,
          duration_minutes INTEGER DEFAULT 0,
          status TEXT DEFAULT 'active',
          FOREIGN KEY (client_id) REFERENCES clients(id)
        )
      `);

      // Concurrent user limits
      db.run(`
        CREATE TABLE IF NOT EXISTS concurrent_limits (
          id INTEGER PRIMARY KEY,
          max_users INTEGER DEFAULT 5,
          current_users INTEGER DEFAULT 0,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

module.exports = {
  initialize,
  run,
  get,
  all,
  close
};
