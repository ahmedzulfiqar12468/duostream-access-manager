const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

let db;
const dbPath = path.join(app.getPath('userData'), 'host-pc.db');

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
      // Master settings table
      db.run(`
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY,
          password_hash TEXT NOT NULL,
          max_concurrent_users INTEGER DEFAULT 5,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // DuoStream accounts table
      db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
          id INTEGER PRIMARY KEY,
          account_name TEXT UNIQUE NOT NULL,
          email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Relay PC connections table
      db.run(`
        CREATE TABLE IF NOT EXISTS relay_connections (
          id INTEGER PRIMARY KEY,
          relay_ip TEXT UNIQUE NOT NULL,
          relay_name TEXT,
          status TEXT DEFAULT 'inactive',
          last_connected DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Active sessions table
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY,
          account_id INTEGER NOT NULL,
          user_token TEXT UNIQUE NOT NULL,
          user_name TEXT,
          relay_ip TEXT,
          status TEXT DEFAULT 'active',
          login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          logout_time DATETIME,
          FOREIGN KEY (account_id) REFERENCES accounts(id)
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Time limits table
      db.run(`
        CREATE TABLE IF NOT EXISTS time_limits (
          id INTEGER PRIMARY KEY,
          account_id INTEGER NOT NULL,
          daily_limit INTEGER DEFAULT 480,
          weekly_limit INTEGER DEFAULT 2400,
          monthly_limit INTEGER DEFAULT 10080,
          daily_used INTEGER DEFAULT 0,
          weekly_used INTEGER DEFAULT 0,
          monthly_used INTEGER DEFAULT 0,
          last_reset_daily DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_reset_weekly DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_reset_monthly DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (account_id) REFERENCES accounts(id)
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Connection schedules table
      db.run(`
        CREATE TABLE IF NOT EXISTS schedules (
          id INTEGER PRIMARY KEY,
          account_id INTEGER NOT NULL,
          day_of_week INTEGER,
          start_time TEXT,
          end_time TEXT,
          FOREIGN KEY (account_id) REFERENCES accounts(id)
        )
      `, (err) => {
        if (err) reject(err);
      });

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
