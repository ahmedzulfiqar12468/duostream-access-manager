const express = require('express');
const http = require('http');
const socketIOClient = require('socket.io-client');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const db = require('./database');

// Socket.io event names
const SOCKET_EVENTS = {
  RELAY_AUTHENTICATE: 'relay:authenticate',
  AUTH_SUCCESS: 'auth:success',
  AUTH_FAILED: 'auth:failed',
  SESSION_START: 'session:start',
  SESSION_END: 'session:end',
  TIME_UPDATE: 'time:update'
};

const DEFAULT_PORTS = {
  HOST_PC: 3001,
  RELAY_PC: 3002
};

let app;
let server;
let socket;
let isConnectedToHost = false;

const start = (mainWindow) => {
  app = express();
  server = http.createServer(app);

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));

  // REST API endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', connectedToHost: isConnectedToHost });
  });

  app.post('/api/connect-to-host', async (req, res) => {
    try {
      const { host_ip, host_port, password, relay_name } = req.body;
      connectToHost(host_ip, host_port, password, relay_name, mainWindow);
      res.json({ status: 'connecting' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/clients', async (req, res) => {
    try {
      const clients = await db.all('SELECT * FROM clients');
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/clients', async (req, res) => {
    try {
      const { account_name } = req.body;
      const user_token = uuidv4();
      const result = await db.run(
        'INSERT INTO clients (account_name, user_token, status) VALUES (?, ?, "pending")',
        [account_name, user_token]
      );

      // Create time limits for this client
      await db.run(
        'INSERT INTO time_limits (client_id) VALUES (?)',
        [result.id]
      );

      res.json({ id: result.id, account_name, user_token, status: 'pending' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/clients/:id', async (req, res) => {
    try {
      const client = await db.get('SELECT * FROM clients WHERE id = ?', [req.params.id]);
      const timeLimits = await db.get('SELECT * FROM time_limits WHERE client_id = ?', [req.params.id]);
      const schedules = await db.all('SELECT * FROM schedules WHERE client_id = ?', [req.params.id]);
      const sessions = await db.all('SELECT * FROM sessions WHERE client_id = ? AND status = "active"', [req.params.id]);

      res.json({ client, timeLimits, schedules, sessions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/clients/:id/time-limits', async (req, res) => {
    try {
      const { daily_limit, weekly_limit, monthly_limit } = req.body;
      await db.run(
        'UPDATE time_limits SET daily_limit = ?, weekly_limit = ?, monthly_limit = ? WHERE client_id = ?',
        [daily_limit, weekly_limit, monthly_limit, req.params.id]
      );
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/clients/:id/schedule', async (req, res) => {
    try {
      const { day_of_week, start_time, end_time } = req.body;
      await db.run(
        'INSERT INTO schedules (client_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
        [req.params.id, day_of_week, start_time, end_time]
      );
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/sessions', async (req, res) => {
    try {
      const sessions = await db.all('SELECT * FROM sessions WHERE status = "active"');
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/sessions/:id/logout', async (req, res) => {
    try {
      const { id } = req.params;
      const session = await db.get('SELECT * FROM sessions WHERE id = ?', [id]);
      if (session) {
        const duration = Math.floor((new Date() - new Date(session.start_time)) / 60000);
        await db.run(
          'UPDATE sessions SET status = "ended", end_time = CURRENT_TIMESTAMP, duration_minutes = ? WHERE id = ?',
          [duration, id]
        );
      }
      res.json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const PORT = DEFAULT_PORTS.RELAY_PC;
  server.listen(PORT, () => {
    console.log(`Relay PC server running on port ${PORT}`);
  });

  return server;
};

const connectToHost = (host_ip, host_port, password, relay_name, mainWindow) => {
  const hostUrl = `http://${host_ip}:${host_port}`;

  socket = socketIOClient(hostUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('Connected to Host PC');
    socket.emit(SOCKET_EVENTS.RELAY_AUTHENTICATE, {
      password,
      relay_name,
      relay_ip: require('os').networkInterfaces()
    });
  });

  socket.on(SOCKET_EVENTS.AUTH_SUCCESS, async () => {
    console.log('Authentication successful');
    isConnectedToHost = true;

    // Save host config
    await db.run(
      'INSERT OR REPLACE INTO host_config (host_ip, host_port, relay_name, connected, last_connected) VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)',
      [host_ip, host_port, relay_name]
    );

    mainWindow.webContents.send('host-connected', { relay_name });
  });

  socket.on(SOCKET_EVENTS.AUTH_FAILED, (data) => {
    console.log('Authentication failed:', data.message);
    isConnectedToHost = false;
    mainWindow.webContents.send('host-connection-failed', data);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Host PC');
    isConnectedToHost = false;
    mainWindow.webContents.send('host-disconnected', {});
  });
};

module.exports = {
  start,
  connectToHost,
  isConnectedToHost: () => isConnectedToHost
};
