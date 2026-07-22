const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { SOCKET_EVENTS, DEFAULT_PORTS } = require('../../shared/constants');
const db = require('./database');

let io;
let app;
let server;
let connectedRelays = new Map();

const start = (mainWindow) => {
  app = express();
  server = http.createServer(app);
  io = new socketIO.Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));

  // REST API endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
  });

  app.get('/api/accounts', async (req, res) => {
    try {
      const accounts = await db.all('SELECT * FROM accounts');
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/accounts', async (req, res) => {
    try {
      const { account_name, email } = req.body;
      const result = await db.run(
        'INSERT INTO accounts (account_name, email) VALUES (?, ?)',
        [account_name, email]
      );
      res.json({ id: result.id, account_name, email });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/sessions', async (req, res) => {
    try {
      const sessions = await db.all(`
        SELECT s.*, a.account_name 
        FROM sessions s 
        JOIN accounts a ON s.account_id = a.id 
        WHERE s.status = 'active'
      `);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/relay-connections', async (req, res) => {
    try {
      const relays = await db.all('SELECT * FROM relay_connections');
      res.json(relays);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Socket.io handlers
  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // Relay PC authentication
    socket.on(SOCKET_EVENTS.RELAY_AUTHENTICATE, async (data) => {
      try {
        const { password, relay_name, relay_ip } = data;
        const settings = await db.get('SELECT * FROM settings LIMIT 1');

        if (!settings) {
          socket.emit(SOCKET_EVENTS.AUTH_FAILED, {
            message: 'Host PC not configured'
          });
          return;
        }

        const isPasswordValid = await bcryptjs.compare(password, settings.password_hash);

        if (isPasswordValid) {
          socket.join('relay-authenticated');
          connectedRelays.set(socket.id, {
            relay_ip,
            relay_name,
            socket_id: socket.id
          });

          // Update relay connection in database
          await db.run(
            `UPDATE relay_connections SET status = 'active', last_connected = CURRENT_TIMESTAMP 
             WHERE relay_ip = ?`,
            [relay_ip]
          );

          socket.emit(SOCKET_EVENTS.AUTH_SUCCESS, {
            message: 'Authentication successful'
          });

          // Notify main window
          mainWindow.webContents.send('relay-connected', {
            relay_name,
            relay_ip
          });
        } else {
          socket.emit(SOCKET_EVENTS.AUTH_FAILED, {
            message: 'Invalid password'
          });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit(SOCKET_EVENTS.AUTH_FAILED, {
          message: error.message
        });
      }
    });

    // Session start
    socket.on(SOCKET_EVENTS.SESSION_START, async (data) => {
      try {
        const { account_id, user_token, user_name, relay_ip } = data;
        const sessionId = uuidv4();

        await db.run(
          `INSERT INTO sessions (account_id, user_token, user_name, relay_ip, status) 
           VALUES (?, ?, ?, ?, 'active')`,
          [account_id, user_token, user_name, relay_ip]
        );

        socket.emit(SOCKET_EVENTS.SESSION_START, {
          session_id: sessionId,
          status: 'success'
        });

        mainWindow.webContents.send('session-started', {
          user_name,
          account_id,
          relay_ip
        });
      } catch (error) {
        socket.emit(SOCKET_EVENTS.SESSION_START, {
          status: 'failed',
          error: error.message
        });
      }
    });

    // Session end
    socket.on(SOCKET_EVENTS.SESSION_END, async (data) => {
      try {
        const { user_token } = data;
        await db.run(
          `UPDATE sessions SET status = 'logged_out', logout_time = CURRENT_TIMESTAMP 
           WHERE user_token = ?`,
          [user_token]
        );

        socket.emit(SOCKET_EVENTS.SESSION_END, { status: 'success' });

        mainWindow.webContents.send('session-ended', { user_token });
      } catch (error) {
        socket.emit(SOCKET_EVENTS.SESSION_END, {
          status: 'failed',
          error: error.message
        });
      }
    });

    // Time update
    socket.on(SOCKET_EVENTS.TIME_UPDATE, async (data) => {
      try {
        const { account_id, minutes_used, time_type } = data;
        const column = `${time_type}_used`;

        const timeLimits = await db.get(
          `SELECT * FROM time_limits WHERE account_id = ?`,
          [account_id]
        );

        if (timeLimits) {
          const currentUsed = timeLimits[column];
          const newUsed = currentUsed + minutes_used;

          await db.run(
            `UPDATE time_limits SET ${column} = ? WHERE account_id = ?`,
            [newUsed, account_id]
          );
        }

        socket.emit(SOCKET_EVENTS.TIME_UPDATE, { status: 'success' });
      } catch (error) {
        socket.emit(SOCKET_EVENTS.TIME_UPDATE, {
          status: 'failed',
          error: error.message
        });
      }
    });

    socket.on('disconnect', async () => {
      try {
        const relayInfo = connectedRelays.get(socket.id);
        if (relayInfo) {
          await db.run(
            `UPDATE relay_connections SET status = 'inactive' WHERE relay_ip = ?`,
            [relayInfo.relay_ip]
          );
          connectedRelays.delete(socket.id);
          mainWindow.webContents.send('relay-disconnected', relayInfo);
        }
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });
  });

  const PORT = DEFAULT_PORTS.HOST_PC;
  server.listen(PORT, () => {
    console.log(`Host PC server running on port ${PORT}`);
  });

  return server;
};

module.exports = {
  start,
  getIO: () => io
};
